/**
 * HSTU Student Bus Tracker - Progressive Web App Service Worker
 * Enhanced with dedicated Bus Schedule caching for offline & limited connection access.
 */

const CACHE_VERSION = "hstu-bus-v5";
const STATIC_CACHE = `hstu-static-${CACHE_VERSION}`;
const SCHEDULE_CACHE = `hstu-schedule-${CACHE_VERSION}`;
const RUNTIME_CACHE = `hstu-runtime-${CACHE_VERSION}`;

// Core application shell assets
const CORE_SHELL_ASSETS = [
  "./",
  "./index.html",
  "index.html",
  "./manifest.json",
  "manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable.png",
  "./apple-touch-icon.png",
  "./favicon.png",
  "./icon.svg"
];

// Bus schedule specific data files to guarantee offline access
const SCHEDULE_ASSETS = [
  "./bus-schedule.html",
  "bus-schedule.html",
  "./bus-schedule-en.html",
  "bus-schedule-en.html",
  "./schedule.js",
  "schedule.js"
];

// Helper: Fast network fetch with configurable timeout (prevents slow 2G/3G hanging)
function fetchWithTimeout(request, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Network timeout"));
    }, timeoutMs);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Installation: Precache core shell and bus schedule assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Precache Core Shell
      caches.open(STATIC_CACHE).then((cache) => {
        return Promise.allSettled(
          CORE_SHELL_ASSETS.map((url) =>
            cache.add(new Request(url, { cache: "reload" })).catch((err) => {
              console.warn(`PWA Shell asset skipped: ${url}`, err.message);
            })
          )
        );
      }),
      // Precache Bus Schedule Data (Highest priority for student offline routine)
      caches.open(SCHEDULE_CACHE).then((cache) => {
        return Promise.allSettled(
          SCHEDULE_ASSETS.map((url) =>
            cache.add(new Request(url, { cache: "reload" })).then(() => {
              console.log(`[PWA SW] Pre-cached schedule asset: ${url}`);
            }).catch((err) => {
              console.warn(`Schedule precache note for ${url}:`, err.message);
            })
          )
        );
      })
    ])
  );
  self.skipWaiting();
});

// Activation: Clean up older cache versions and take immediate client control
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, SCHEDULE_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log(`[PWA SW] Removing deprecated cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch routing: Optimized caching strategies
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip non-GET requests and dynamic backend/auth services
  if (
    request.method !== "GET" ||
    url.hostname.includes("firebaseio.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com") ||
    url.hostname.includes("securetoken.googleapis.com") ||
    url.hostname.includes("firestore.googleapis.com")
  ) {
    return;
  }

  // 2. BUS SCHEDULE ASSETS STRATEGY: Stale-While-Revalidate with Fast Offline Serving
  // Allows instant offline schedule display at bus stands or during commute without internet
  const isScheduleAsset =
    url.pathname.endsWith("bus-schedule.html") ||
    url.pathname.endsWith("bus-schedule-en.html") ||
    url.pathname.endsWith("schedule.js");

  if (isScheduleAsset) {
    event.respondWith(
      caches.open(SCHEDULE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        // Fetch in parallel to refresh schedule if online
        const networkFetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((fetchErr) => {
            // Offline or weak signal - ignore network failure if cached
            return null;
          });

        if (cachedResponse) {
          // Serve cached version immediately for instant responsiveness
          // Background revalidation updates the cache for next session
          event.waitUntil(networkFetchPromise);
          return cachedResponse;
        }

        // Not yet in cache, wait for network or provide fallback
        const networkResponse = await networkFetchPromise;
        if (networkResponse) return networkResponse;

        // Fallback: check static cache or root index
        const staticMatch = await caches.match(request);
        if (staticMatch) return staticMatch;

        return new Response(
          "<!-- Offline Bus Schedule Fallback --><div>Schedule temporarily unavailable offline. Please refresh when connected.</div>",
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      })
    );
    return;
  }

  // 3. NAVIGATION REQUESTS (HTML page load / reload)
  // Fast network with quick cache fallback so student doesn't wait on slow 2G
  if (request.mode === "navigate") {
    event.respondWith(
      fetchWithTimeout(request, 2500)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline or network timeout - serve cached app shell
          const cachedNavigate = await caches.match(request);
          if (cachedNavigate) return cachedNavigate;
          const rootMatch = await caches.match("./index.html");
          if (rootMatch) return rootMatch;
          return caches.match("index.html");
        })
    );
    return;
  }

  // 4. THIRD-PARTY RUNTIME ASSETS (Tailwind CDN, Google Fonts)
  if (
    url.hostname.includes("cdn.tailwindcss.com") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          // Revalidate in background
          fetch(request).then((res) => {
            if (res && res.status === 200) {
              cache.put(request, res.clone());
            }
          }).catch(() => {});
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === "opaque")) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (e) {
          return cachedResponse || Response.error();
        }
      })
    );
    return;
  }

  // 5. OTHER STATIC ASSETS (Icons, manifest, images)
  // Cache-first with network refresh
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const copy = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, copy);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return 404 or empty response if network is dead
        return new Response("", { status: 408, statusText: "Offline" });
      });
    })
  );
});

// Client Message Listener: Allows manual trigger of schedule caching & status checks
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === "CACHE_SCHEDULE_NOW") {
    caches.open(SCHEDULE_CACHE).then(async (cache) => {
      let successCount = 0;
      for (const url of SCHEDULE_ASSETS) {
        try {
          const res = await fetch(url, { cache: "reload" });
          if (res.ok) {
            await cache.put(url, res);
            successCount++;
          }
        } catch (e) {
          console.warn("[PWA SW] Failed to manually cache schedule asset:", url);
        }
      }
      if (event.source) {
        event.source.postMessage({
          type: "SCHEDULE_CACHE_COMPLETED",
          success: successCount > 0,
          timestamp: Date.now()
        });
      }
    });
  }

  if (data.type === "CHECK_OFFLINE_READY") {
    caches.open(SCHEDULE_CACHE).then(async (cache) => {
      const scheduleMatch = await cache.match("bus-schedule.html") || await cache.match("./bus-schedule.html");
      const scriptMatch = await cache.match("schedule.js") || await cache.match("./schedule.js");
      if (event.source) {
        event.source.postMessage({
          type: "OFFLINE_STATUS_REPORT",
          isScheduleCached: Boolean(scheduleMatch && scriptMatch),
          timestamp: Date.now()
        });
      }
    });
  }
});
