/**
 * HSTU Bus Schedule Sliced Module (schedule.js)
 * 
 * Separated schedule data and view renderer for easy maintenance.
 * Whenever HSTU Transport Section changes bus timings or routes,
 * update this file or 'bus-schedule.html' directly without touching index.html.
 */

(function () {
    'use strict';

    // Structured Bus Schedule Data
    const HSTU_SCHEDULE_DATA = {
        meta: {
            titleBn: "পরিবহন ও যন্ত্র মেরামত শাখা",
            universityBn: "হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, দিনাজপুর",
            memoBn: "স্মারক নং: হাবিপ্রবি/২০২৬/পশা/",
            dateBn: "কার্যকর: ২১/০৭/২০২৬ খ্রীঃ হতে",
            effectiveEn: "Effective: Sunday to Thursday (Updated 2026)",
            titleEn: "Transport & Maintenance Section - HSTU Bus Routine"
        },
        weekdayTrips: [
            { categoryEn: "General", categoryBn: "সাধারণ", campusTime: "06:40 AM", campusTimeBn: "সকাল-৬:৪০ মি:", campusBus: "15", campusBusBn: "১৫", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "07:50 AM (Balubari / Shahi Masjid)", cityTimeBn: "সকাল: ৭:৫০ মি: বালুবাড়ী (শ.মি.)", cityBus: "15", cityBusBn: "১৫" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "08:00 AM", campusTimeBn: "সকাল-৮:০০ টা", campusBus: "4, 20", campusBusBn: "৪, ২০", cityCategoryEn: "Officers", cityCategoryBn: "কর্মকর্তা", cityTime: "08:20 AM (Balubari / Shahi Masjid)", cityTimeBn: "সকাল: ৮:২০ মি: (বালুবাড়ী শ.মি.)", cityBus: "4, 20", cityBusBn: "৪, ২০" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "08:00 AM", campusTimeBn: "সকাল-৮:০০ টা", campusBus: "8", campusBusBn: "৮", cityCategoryEn: "Staff", cityCategoryBn: "কর্মচারী", cityTime: "08:15 AM (Balubari / Shahi Masjid)", cityTimeBn: "সকাল- ৮:১৫ মি: (বালুবাড়ী শ.মি.)", cityBus: "8", cityBusBn: "৮" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "08:00 AM", campusTimeBn: "সকাল-৮:০০ টা", campusBus: "11", campusBusBn: "১১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "08:20 AM (Boromath, DD-2) / 08:30 AM (Suihari)", cityTimeBn: "সকাল-৮:২০মি:(বড়: দিতল-২)(স:৮:৩০মি: সুই:১২)", cityBus: "Bus 11, Double Decker 2", cityBusBn: "১১, দিতল-২" },
            { categoryEn: "Faculty", categoryBn: "শিক্ষক", campusTime: "08:00 AM", campusTimeBn: "সকাল-৮:০০ টা", campusBus: "1, 2, 3, 15 (M-5)", campusBusBn: "১, ২, ৩, ১৫(m-5)", cityCategoryEn: "Faculty", cityCategoryBn: "শিক্ষক", cityTime: "08:30 AM (Designated Route)", cityTimeBn: "সকাল- ৮:৩০ মি: (নির্ধারিত রুট)", cityBus: "(1, 15), (2, M-5), (3)", cityBusBn: "(১,১৫)(২,m-5)(৩)" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "08:30 AM", campusTimeBn: "সকাল- ৮:৩০ মি:", campusBus: "7, 17", campusBusBn: "৭, ১৭", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "09:00 AM (Boromath) / 09:15 AM (Terminal)", cityTimeBn: "সকাল-৯:০০ টা (বড়মাঠ) (স:৯:১৫ মি: টার্মিনাল-৭)", cityBus: "Bus 7, 17, Double Decker 3", cityBusBn: "৭,১৭,দিতল-৩" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "09:00 AM", campusTimeBn: "সকাল- ৯:০০ টা", campusBus: "(Suihari 8, 16), 19", campusBusBn: "(সুইহারী ৮,১৬),১৯", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "09:30 AM (Boromath, DD-1, 19) / 09:35 AM (Suihari)", cityTimeBn: "স:৯:৩০ মি:(বড়:দি:১,১৯)(৯:৩৫মি:সুই:৮,১৬)", cityBus: "Bus 8, 16, 19, Double Decker 1", cityBusBn: "৮,১৬,১৯,দিতল-১" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "09:30 AM", campusTimeBn: "সকাল-৯:৩০ মি:", campusBus: "15, 21", campusBusBn: "১৫, ২১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "10:00 AM (Boromath)", cityTimeBn: "সকাল-১০:০০ টা: (বড়মাঠ)", cityBus: "15, 21", cityBusBn: "১৫, ২১" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "10:00 AM", campusTimeBn: "সকাল-১০:০০ টা", campusBus: "8, 11, DD-2", campusBusBn: "৮,১১,দি:২", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "10:30 AM (Boromath) / 10:45 AM (Terminal)", cityTimeBn: "সকাল-১০:৩০মি:(বড়-দি:২)(সুই:১১)(টার্মি-স:১০.৪৫মি: ৮)", cityBus: "Bus 8, 11, Double Decker 2", cityBusBn: "৮,১১,দি:২" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "10:30 AM", campusTimeBn: "সকাল-১০:৩০ মি:", campusBus: "16, 19, 20", campusBusBn: "১৬, ১৯, ২০", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "11:00 AM (Boromath) / 11:15 AM (Terminal)", cityTimeBn: "সকাল-১১:০০ টা: (বড়মাঠ) (টার্মি-স:১১.১৫মি: ১৯)", cityBus: "16, 19, 20", cityBusBn: "১৬, ১৯, ২০" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "11:00 AM", campusTimeBn: "সকাল-১১:০০ টা", campusBus: "17, DD-3", campusBusBn: "১৭, দিতল-৩", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "11:30 AM (Boromath) / 11:45 AM (Terminal)", cityTimeBn: "সকাল-১১:৩০ মি: (বড়-দি:৩) (টার্মি-১১:৪৫মি:১৭)", cityBus: "Bus 17, Double Decker 3", cityBusBn: "১৭, দিতল-৩" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "11:30 AM", campusTimeBn: "সকাল- ১১:৩০ মি:", campusBus: "15, 21", campusBusBn: "১৫, ২১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "12:00 PM (Boromath)", cityTimeBn: "দুপুর- ১২:০০ টা (বড়মাঠ)", cityBus: "15, 21", cityBusBn: "১৫, ২১" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "12:00 PM", campusTimeBn: "দুপুর- ১২:০০ টা", campusBus: "16, 19", campusBusBn: "১৬, ১৯", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "12:30 PM (Boromath)", cityTimeBn: "দুপুর- ১২:৩০ মি: (বড়মাঠ)", cityBus: "16, 19", cityBusBn: "১৬, ১৯" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "12:30 PM", campusTimeBn: "দুপুর- ১২:৩০ মি:", campusBus: "17, DD-1", campusBusBn: "১৭, দিতল-১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "01:00 PM (Boromath)", cityTimeBn: "দুপুর- ১:০০ টা: (বড়মাঠ)", cityBus: "Bus 17, Double Decker 1", cityBusBn: "১৭, দিতল-১" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "01:00 PM", campusTimeBn: "দুপুর- ১:০০ টা", campusBus: "15 (Terminal), 21, 20", campusBusBn: "(টার্মি-১৫),২১,২০", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "01:30 PM (Boromath)", cityTimeBn: "দুপুর- ১:৩০ মি: (বড়মাঠ)", cityBus: "15, 21, 20", cityBusBn: "১৫, ২১, ২০" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "01:30 PM", campusTimeBn: "দুপুর- ১:৩০ মি:", campusBus: "Double Decker 2", campusBusBn: "দিতল-২", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "02:00 PM (Boromath)", cityTimeBn: "দুপুর- ২:০০ টা (বড়মাঠ)", cityBus: "Double Decker 2", cityBusBn: "দিতল-২" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "02:00 PM", campusTimeBn: "দুপুর- ২:০০ টা", campusBus: "8, 11, 19", campusBusBn: "৮,১১,১৯", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "02:30 PM (Boromath)", cityTimeBn: "দুপুর- ২:৩০ মি: (বড়মাঠ)", cityBus: "11, 19", cityBusBn: "১১,১৯" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "02:30 PM", campusTimeBn: "দুপুর- ২:৩০ মি:", campusBus: "7, DD-3", campusBusBn: "৭, দিতল-৩", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "03:00 PM (Boromath)", cityTimeBn: "দুপুর- ৩:০০ টা (বড়মাঠ)", cityBus: "Double Decker 3", cityBusBn: "দিতল-৩" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "03:00 PM", campusTimeBn: "দুপুর- ৩:০০ টা", campusBus: "16, 17", campusBusBn: "১৬, ১৭", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "03:30 PM (Boromath)", cityTimeBn: "বিকাল- ৩:৩০ মি: (বড়মাঠ)", cityBus: "16, 17", cityBusBn: "১৬, ১৭" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "03:30 PM", campusTimeBn: "দুপুর- ৩:৩০ মি:", campusBus: "21, DD-1", campusBusBn: "২১, দিতল-১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "04:00 PM (Boromath)", cityTimeBn: "বিকাল- ৪:০০ টা (বড়মাঠ)", cityBus: "Bus 21, Double Decker 1", cityBusBn: "২১, দিতল-১" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "04:05 PM", campusTimeBn: "বিকাল- ৪:০৫ মি:", campusBus: "11, 19, DD-2", campusBusBn: "১১, ১৯, দিতল-২", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "04:30 PM (Boromath)", cityTimeBn: "বিকাল- ৪:৩০ মি: (বড়মাঠ)", cityBus: "Bus 11, Double Decker 2", cityBusBn: "১১, দিতল-২" },
            { categoryEn: "Faculty", categoryBn: "শিক্ষক", campusTime: "04:05 PM", campusTimeBn: "বিকাল- ৪:০৫ মি:", campusBus: "1, 2, 3, 15 (M-5)", campusBusBn: "১, ২, ৩, ১৫(m-5)", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "05:00 PM (Boromath)", cityTimeBn: "বিকাল- ৫:০০ টা (বড়মাঠ)", cityBus: "15", cityBusBn: "১৫" },
            { categoryEn: "Officers & Staff", categoryBn: "কর্মকর্তা কর্মচারী", campusTime: "04:05 PM", campusTimeBn: "বিকাল- ৪:০৫ মি:", campusBus: "4, 8, 20", campusBusBn: "৪, ৮, ২০", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "05:00 PM (Boromath)", cityTimeBn: "বিকাল- ৫:০০ টা (বড়মাঠ)", cityBus: "8", cityBusBn: "৮" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "04:30 PM", campusTimeBn: "বিকাল- ৪:৩০ মি:", campusBus: "17, DD-3", campusBusBn: "১৭, দিতল-৩", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "05:30 PM (Boromath)", cityTimeBn: "বিকাল- ৫:৩০ মি: (বড়মাঠ)", cityBus: "Bus 17, Double Decker 3", cityBusBn: "১৭, দিতল-৩" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "05:00 PM", campusTimeBn: "বিকাল- ৫:০০ টা", campusBus: "21, DD-1", campusBusBn: "২১, দি:-১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "06:00 PM (Boromath)", cityTimeBn: "বিকাল- ৬:০০ টা (বড়মাঠ)", cityBus: "Bus 21, Double Decker 1", cityBusBn: "২১, দি:-১" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "05:30 PM", campusTimeBn: "বিকাল- ৫:৩০ মি:", campusBus: "11, 16, 19", campusBusBn: "১১, ১৬, ১৯", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "06:30 PM (Boromath)", cityTimeBn: "সন্ধ্যা- ৬:৩০ মি: (বড়মাঠ)", cityBus: "11, 19", cityBusBn: "১১, ১৯" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "06:00 PM", campusTimeBn: "বিকাল- ৬:০০ টা", campusBus: "8, DD-2", campusBusBn: "৮, দিতল-২", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "07:00 PM (Boromath)", cityTimeBn: "রাত- ৭:০০ টা (বড়মাঠ)", cityBus: "Bus 8, Double Decker 2", cityBusBn: "৮, দিতল-২" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "06:30 PM", campusTimeBn: "সন্ধ্যা-৬:৩০ মি:", campusBus: "17, DD-3", campusBusBn: "১৭, দিতলবাস-৩", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "07:30 PM (Boromath)", cityTimeBn: "রাত- ৭:৩০ মি: (বড়মাঠ)", cityBus: "Bus 16, 17, (20 Female)", cityBusBn: "১৬,১৭, (২০ ছাত্রী)" },
            { categoryEn: "Students", categoryBn: "ছাত্র-ছাত্রী", campusTime: "07:00 PM", campusTimeBn: "রাত- ৭:০০ টা", campusBus: "21, DD-1", campusBusBn: "২১, দিতলবাস-১", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "08:00 PM (Boromath)", cityTimeBn: "রাত- ৮:০০ টা (বড়মাঠ)", cityBus: "Bus 21, Double Decker 3", cityBusBn: "২১, দিতলবাস-৩" },
            { categoryEn: "General", categoryBn: "সাধারণ", campusTime: "07:30 PM", campusTimeBn: "রাত- ৭:৩০ মি:", campusBus: "To BRTC Depot", campusBusBn: "বিআরটিসি ডিপো পর্যন্ত", cityCategoryEn: "Students", cityCategoryBn: "ছাত্র-ছাত্রী", cityTime: "09:00 PM (Boromath)", cityTimeBn: "রাত- ৯:০০ টা (বড়মাঠ)", cityBus: "Double Decker 1", cityBusBn: "দিতলবাস-১" },
            { categoryEn: "General", categoryBn: "সাধারণ", campusTime: "08:30 PM", campusTimeBn: "রাত- ৮:৩০ মি:", campusBus: "Double Decker 3 (BRTC Depot)", campusBusBn: "দিতলবাস- ৩ (বিআরটিসি)", cityCategoryEn: "General", cityCategoryBn: "সাধারণ", cityTime: "BRTC Depot Service", cityTimeBn: "বিআরটিসি ডিপো পর্যন্ত", cityBus: "Double Decker 3", cityBusBn: "দিতলবাস- ৩" },
            { categoryEn: "General", categoryBn: "সাধারণ", campusTime: "09:30 PM", campusTimeBn: "রাত- ৯:৩০ মি:", campusBus: "Double Decker 1 (BRTC Depot)", campusBusBn: "দিতলবাস- ১ (বিআরটিসি)", cityCategoryEn: "General", cityCategoryBn: "সাধারণ", cityTime: "BRTC Depot Service", cityTimeBn: "বিআরটিসি ডিপো পর্যন্ত", cityBus: "Double Decker 1", cityBusBn: "দিতলবাস- ১" }
        ],
        specialTrips: [
            { dayEn: "Friday", dayBn: "শুক্রবার", targetEn: "Teachers, Officers & Staff", targetBn: "শিক্ষক, কর্মকর্তা,কর্মচারী", campusDepEn: "09:00 AM (Bus 15)", campusDepBn: "সকাল- ৯:০০ টা / ১৫", cityDepEn: "11:00 AM (Bus 15)", cityDepBn: "সকাল- ১১:০০ টা / ১৫" },
            { dayEn: "Saturday", dayBn: "শনিবার", targetEn: "Teachers & Officers", targetBn: "শিক্ষক ও কর্মকর্তা", campusDepEn: "04:00 PM (Bus 19)", campusDepBn: "বিকাল- ৪:০০টা / ১৯", cityDepEn: "06:00 PM Boromath (Bus 19)", cityDepBn: "বিকাল- ৬:০০ টা বড়মাঠ / ১৯" },
            { dayEn: "Saturday", dayBn: "শনিবার", targetEn: "Staff & Employees", targetBn: "কর্মচারী", campusDepEn: "04:00 PM (Bus 11)", campusDepBn: "বিকাল- ৪:০০টা / ১১", cityDepEn: "06:00 PM Boromath (Bus 11)", cityDepBn: "বিকাল- ৬:০০ টা বড়মাঠ / ১১" },
            { dayEn: "Saturday", dayBn: "শনিবার", targetEn: "Students", targetBn: "ছাত্র-ছাত্রী", campusDepEn: "04:00 PM (Bus 8, 17, 21)", campusDepBn: "বিকাল- ৪:০০টা / ৮,১৭,২১", cityDepEn: "07:00 PM Boromath (Bus 8, 17, 21)", cityDepBn: "রাত- ৭:০০ টা বড়মাঠ / ৮,১৭,২১" },
            { dayEn: "Tuesday", dayBn: "মঙ্গলবার", targetEn: "Teachers & Officers", targetBn: "শিক্ষক ও কর্মকর্তা", campusDepEn: "04:00 PM (Bus 16, 20)", campusDepBn: "বিকাল- ৪:০০ টা / ১৬,২০", cityDepEn: "06:00 PM Boromath (Microbus 5)", cityDepBn: "বিকাল- ৬:০০ টা বড়মাঠ / মাইজে-৫" }
        ]
    };

    window.HSTU_SCHEDULE_DATA = HSTU_SCHEDULE_DATA;

    /**
     * Render the English timetable container dynamically
     */
    /**
     * Fallback English Schedule Generator in case bus-schedule-en.html cannot be fetched
     */
    function renderEnglishFallback(container) {
        if (!container) return;

        const rows = HSTU_SCHEDULE_DATA.weekdayTrips.map(t => `
            <tr>
                <td class="p-2 border border-[#737373]">${t.categoryEn}</td>
                <td class="p-2 border border-[#737373]">${t.campusTime}</td>
                <td class="p-2 border border-[#737373] font-semibold">${t.campusBus}</td>
                <td class="p-2 border border-[#737373]">${t.cityCategoryEn}</td>
                <td class="p-2 border border-[#737373]">${t.cityTime}</td>
                <td class="p-2 border border-[#737373] font-semibold">${t.cityBus}</td>
            </tr>
        `).join("");

        const specialRows = HSTU_SCHEDULE_DATA.specialTrips.map(s => `
            <tr>
                <td class="p-2 border border-[#737373]">${s.dayEn}</td>
                <td class="p-2 border border-[#737373]">${s.targetEn}</td>
                <td class="p-2 border border-[#737373]">${s.campusDepEn}</td>
                <td class="p-2 border border-[#737373]">${s.dayEn}</td>
                <td class="p-2 border border-[#737373]">${s.targetEn}</td>
                <td class="p-2 border border-[#737373]">${s.cityDepEn}</td>
            </tr>
        `).join("");

        container.innerHTML = `
            <div class="sheet p-4 sm:p-6 bg-white border border-[#737373] rounded-lg max-w-[1150px] mx-auto shadow-sm" style="font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div class="header text-center pb-2.5 border-b border-slate-200">
                    <p style="margin:0;font-size:15px;" class="text-slate-800 font-semibold">Transport &amp; Vehicle Repair Section</p>
                    <h2 class="text-emerald-950 font-black text-lg md:text-xl mt-1">Hajee Mohammad Danesh Science &amp; Technology University, Dinajpur</h2>
                </div>
                <div class="memo-row flex justify-between text-xs text-slate-700 my-2.5 font-medium">
                    <span>Memo No: HSTU/2026/Transport/</span>
                    <span>Date: 20/07/2026 AD</span>
                </div>
                <div class="title-box text-center my-2.5">
                    <span style="border: 1.5px solid #000; background: #fff; color: #000; padding: 4px 22px; font-weight: 800; font-size: 16px; border-radius: 4px; display: inline-block;">Bus Time Schedule</span>
                </div>
                <div class="subtitle text-center text-xs font-bold text-slate-800 mb-2.5">Sunday to Thursday (Effective from: 21/07/2026 AD)</div>
                <div class="overflow-x-auto rounded border border-[#737373] touch-pan-x mb-4 bg-white">
                    <table class="w-full text-xs text-center border-collapse min-w-[720px] text-black">
                        <thead>
                            <tr style="background:#dcd8c9;" class="text-black font-extrabold border-b border-[#737373]">
                                <th colspan="3" class="p-2 border border-[#737373] text-sm">From Campus</th>
                                <th colspan="3" class="p-2 border border-[#737373] text-sm">From City</th>
                            </tr>
                            <tr style="background:#dcd8c9;" class="text-black font-bold border-b border-[#737373]">
                                <th class="p-2 border border-[#737373]">Trip Name</th>
                                <th class="p-2 border border-[#737373]">Departure Time</th>
                                <th class="p-2 border border-[#737373]">Vehicle No.</th>
                                <th class="p-2 border border-[#737373]">Trip Name</th>
                                <th class="p-2 border border-[#737373]">Departure Place &amp; Time</th>
                                <th class="p-2 border border-[#737373]">Vehicle No.</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#737373]">${rows}</tbody>
                    </table>
                </div>
                <div class="overflow-x-auto rounded border border-[#737373] touch-pan-x mb-4 bg-white">
                    <table class="w-full text-xs text-center border-collapse min-w-[600px] text-black">
                        <thead>
                            <tr style="background:#dcd8c9;" class="text-black font-extrabold border-b border-[#737373]">
                                <th colspan="6" class="p-2 border border-[#737373] text-sm">Special Trips</th>
                            </tr>
                            <tr style="background:#dcd8c9;" class="text-black font-bold border-b border-[#737373]">
                                <th class="p-2 border border-[#737373]">Day</th>
                                <th class="p-2 border border-[#737373]">Passengers</th>
                                <th class="p-2 border border-[#737373]">Departure Time</th>
                                <th class="p-2 border border-[#737373]">Day</th>
                                <th class="p-2 border border-[#737373]">Passengers</th>
                                <th class="p-2 border border-[#737373]">Departure Time</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#737373]">${specialRows}</tbody>
                    </table>
                </div>
                <div class="text-xs bg-slate-50 p-3 rounded border-l-4 border-emerald-600 text-slate-700">
                    ***Student buses will operate via the bypass road, and teacher/officer &amp; staff buses will operate on designated routes.<br>
                    Special Note: The number of trips may increase or decrease as necessary.
                </div>
                <div class="flex justify-end mt-5 text-xs text-slate-700">
                    <div class="text-right font-bold text-slate-900">
                        <p>Director (Transport)<br>HSTU, Dinajpur.</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Backward-compatible alias
     */
    function renderEnglishSchedule(containerId) {
        const container = containerId ? document.getElementById(containerId) : document.getElementById("scheduleEnglishContainer");
        if (container) renderEnglishFallback(container);
    }

    /**
     * Update Schedule Offline Status Badge in UI
     */
    function updateScheduleOfflineBadge(isOffline, isCached = true) {
        const badge = document.getElementById("scheduleOfflineBadge");
        const text = document.getElementById("scheduleOfflineBadgeText");
        const dot = document.getElementById("scheduleOfflineBadgeDot");
        if (!badge || !text) return;

        badge.classList.remove("hidden");
        const isEn = window.currentLang === 'en';
        if (isOffline) {
            badge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 transition shadow-xs";
            text.textContent = isEn ? "⚡ Offline Mode (Cached Schedule)" : "⚡ অফলাইন মোড (ক্যাশড সময়সূচী)";
            if (dot) dot.className = "w-2 h-2 rounded-full bg-amber-500 animate-pulse";
        } else {
            badge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 transition shadow-xs";
            text.textContent = isCached 
                ? (isEn ? "💾 Offline Ready" : "💾 অফলাইনে সংরক্ষিত")
                : (isEn ? "🌐 Live Connected" : "🌐 লাইভ কানেক্টেড");
            if (dot) dot.className = "w-2 h-2 rounded-full bg-emerald-500";
        }
    }

    /**
     * Helper to resolve asset path reliably across subpaths
     */
    function getAssetPath(filename) {
        let basePath = window.location.pathname;
        if (basePath.endsWith("/index.html") || basePath.endsWith("/index.htm")) {
            basePath = basePath.substring(0, basePath.lastIndexOf("/") + 1);
        } else if (!basePath.endsWith("/")) {
            basePath += "/";
        }
        return window.location.origin + basePath + filename;
    }

    /**
     * Load the Bangla notice schedule fragment from bus-schedule.html
     * Enhanced with Instant Render + Service Worker caching + localStorage backup for offline access
     */
    let scheduleLoaded = false;
    async function loadSchedule(force = false) {
        const container = document.getElementById("scheduleFragment");
        if (!container) return;
        if (scheduleLoaded && !force && container.querySelector("table")) return;

        // STEP 1: Instant render from cache or dynamic fallback
        let rendered = false;
        try {
            const cachedHtml = localStorage.getItem("hstu_cached_bus_schedule_html");
            if (cachedHtml && cachedHtml.length > 200 && cachedHtml.includes("<table")) {
                container.innerHTML = cachedHtml;
                scheduleLoaded = true;
                rendered = true;
            }
        } catch (e) {}

        if (!rendered && !container.querySelector("table")) {
            renderBanglaFallback(container);
            scheduleLoaded = true;
        }

        // STEP 2: Background refresh from bus-schedule.html
        const scheduleUrl = getAssetPath("bus-schedule.html");
        const controller = new AbortController();
        const timeoutTimer = setTimeout(() => controller.abort(), 8000);

        try {
            const res = await fetch(scheduleUrl, { signal: controller.signal });
            clearTimeout(timeoutTimer);
            if (res.ok) {
                const html = await res.text();
                if (html && html.includes("<table")) {
                    container.innerHTML = html;
                    scheduleLoaded = true;

                    try {
                        localStorage.setItem("hstu_cached_bus_schedule_html", html);
                        localStorage.setItem("hstu_schedule_cached_time", Date.now().toString());
                    } catch (e) {}
                }
            }
        } catch (err) {
            clearTimeout(timeoutTimer);
            console.log("[Schedule BN] Network fetch note:", err.message);
        }

        updateScheduleOfflineBadge(!navigator.onLine, true);
    }

    /**
     * Load the English schedule fragment from bus-schedule-en.html
     * Enhanced with Instant Render + Service Worker caching + localStorage backup for offline access
     */
    let scheduleEnLoaded = false;
    async function loadEnglishSchedule(force = false) {
        const container = document.getElementById("scheduleEnglishContainer");
        if (!container) return;
        if (scheduleEnLoaded && !force && container.querySelector("table")) return;

        // STEP 1: Instant render from cache or dynamic fallback
        let rendered = false;
        try {
            const cachedHtml = localStorage.getItem("hstu_cached_bus_schedule_en_html");
            if (cachedHtml && cachedHtml.length > 200 && cachedHtml.includes("<table") && !cachedHtml.includes("Times New Roman")) {
                container.innerHTML = cachedHtml;
                scheduleEnLoaded = true;
                rendered = true;
            }
        } catch (e) {}

        if (!rendered && !container.querySelector("table")) {
            renderEnglishFallback(container);
            scheduleEnLoaded = true;
        }

        // STEP 2: Background refresh from bus-schedule-en.html
        const scheduleUrl = getAssetPath("bus-schedule-en.html");
        const controller = new AbortController();
        const timeoutTimer = setTimeout(() => controller.abort(), 8000);

        try {
            const res = await fetch(scheduleUrl, { signal: controller.signal });
            clearTimeout(timeoutTimer);
            if (res.ok) {
                const html = await res.text();
                if (html && html.includes("<table")) {
                    container.innerHTML = html;
                    scheduleEnLoaded = true;

                    try {
                        localStorage.setItem("hstu_cached_bus_schedule_en_html", html);
                        localStorage.setItem("hstu_schedule_en_cached_time", Date.now().toString());
                    } catch (e) {}
                }
            }
        } catch (err) {
            clearTimeout(timeoutTimer);
            console.log("[Schedule EN] Network fetch note:", err.message);
        }

        updateScheduleOfflineBadge(!navigator.onLine, true);
    }

    /**
     * Fallback Bangla Notice Generator in case bus-schedule.html cannot be fetched
     */
    function renderBanglaFallback(container) {
        if (!container) return;
        const rows = HSTU_SCHEDULE_DATA.weekdayTrips.map(t => `
            <tr>
                <td>${t.categoryBn}</td><td>${t.campusTimeBn}</td><td>${t.campusBusBn}</td>
                <td>${t.cityCategoryBn}</td><td>${t.cityTimeBn}</td><td>${t.cityBusBn}</td>
            </tr>
        `).join("");

        const specialRows = HSTU_SCHEDULE_DATA.specialTrips.map(s => `
            <tr>
                <td>${s.dayBn}</td><td>${s.targetBn}</td><td>${s.campusDepBn}</td>
                <td>${s.dayBn}</td><td>${s.targetBn}</td><td>${s.cityDepBn}</td>
            </tr>
        `).join("");

        container.innerHTML = `
            <div class="sheet p-4 sm:p-6 bg-white border border-[#737373] rounded-lg max-w-[1150px] mx-auto shadow-sm">
                <div class="header text-center pb-2.5 border-b border-slate-200">
                    <p style="margin:0;font-size:15px;" class="text-slate-800 font-semibold">পরিবহন ও যন্ত্র মেরামত শাখা</p>
                    <h2 class="text-emerald-950 font-black text-lg md:text-xl mt-1">হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, দিনাজপুর</h2>
                </div>
                <div class="memo-row flex justify-between text-xs text-slate-700 my-2.5 font-medium">
                    <span>স্মারক নং: হাবিপ্রবি/২০২৬/পশা/</span>
                    <span>তারিখ: ২০/০৭/২০২৬ খ্রি:</span>
                </div>
                <div class="title-box text-center my-2.5">
                    <span style="border: 1.5px solid #000; background: #fff; color: #000; padding: 4px 22px; font-weight: 800; font-size: 16px; border-radius: 4px; display: inline-block;">গাড়ীর সময় সূচী</span>
                </div>
                <div class="subtitle text-center text-xs font-bold text-slate-800 mb-2.5">রবিবার হতে বৃহস্পতিবার (কার্যকর: ২১/০৭/২০২৬ খ্রীঃ হতে)</div>
                <div class="overflow-x-auto rounded border border-[#737373] touch-pan-x mb-4 bg-white">
                    <table class="w-full text-xs text-center border-collapse min-w-[720px] text-black">
                        <thead>
                            <tr style="background:#dcd8c9;" class="text-black font-extrabold border-b border-[#737373]">
                                <th colspan="3" class="p-2 border border-[#737373] text-sm">ক্যাম্পাস হতে</th>
                                <th colspan="3" class="p-2 border border-[#737373] text-sm">শহর হতে</th>
                            </tr>
                            <tr style="background:#dcd8c9;" class="text-black font-bold border-b border-[#737373]">
                                <th class="p-2 border border-[#737373]">ট্রিপের নাম</th>
                                <th class="p-2 border border-[#737373]">ছাড়ার সময়</th>
                                <th class="p-2 border border-[#737373]">গাড়ীর নম্বর</th>
                                <th class="p-2 border border-[#737373]">ট্রিপের নাম</th>
                                <th class="p-2 border border-[#737373]">ছাড়ার স্থান ও সময়</th>
                                <th class="p-2 border border-[#737373]">গাড়ীর নম্বর</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#737373]">${rows}</tbody>
                    </table>
                </div>
                <div class="overflow-x-auto rounded border border-[#737373] touch-pan-x mb-4 bg-white">
                    <table class="w-full text-xs text-center border-collapse min-w-[600px] text-black">
                        <thead>
                            <tr style="background:#dcd8c9;" class="text-black font-extrabold border-b border-[#737373]">
                                <th colspan="6" class="p-2 border border-[#737373] text-sm">বিশেষ ট্রিপ</th>
                            </tr>
                            <tr style="background:#dcd8c9;" class="text-black font-bold border-b border-[#737373]">
                                <th class="p-2 border border-[#737373]">বার</th>
                                <th class="p-2 border border-[#737373]">যাত্রী</th>
                                <th class="p-2 border border-[#737373]">ছাড়ার সময়</th>
                                <th class="p-2 border border-[#737373]">বার</th>
                                <th class="p-2 border border-[#737373]">যাত্রী</th>
                                <th class="p-2 border border-[#737373]">ছাড়ার সময়</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#737373]">${specialRows}</tbody>
                    </table>
                </div>
                <div class="text-xs bg-slate-50 p-3 rounded border-l-4 border-emerald-600 text-slate-700">
                    ***ছাত্র-ছাত্রীদের গাড়ীগুলি বাইপাস হয়ে চলাচল করবে এবং শিক্ষক/কর্মকর্তা ও কর্মচারীগণের গাড়ীগুলি নির্ধারিত রুটে চলাচল করবে।<br>
                    বিশেষ দ্রষ্টব্য: প্রয়োজনে ট্রিপের সংখ্যা কম বা বেশী হতে পারে।
                </div>
                <div class="flex justify-end mt-5 text-xs text-slate-700">
                    <div class="text-right font-bold text-slate-900">
                        <p>পরিচালক (পরিবহন)<br>হাবিপ্রবি, দিনাজপুর।</p>
                    </div>
                </div>
            </div>
        `;
        scheduleLoaded = true;
    }

    /**
     * Switch Schedule View (Bangla Notice vs English Table)
     * Animates smooth swipe transition and switches the active HTML fragment
     */
    window.switchScheduleView = function(view) {
        const bnContainer = document.getElementById("scheduleFragment");
        const enContainer = document.getElementById("scheduleEnglishContainer");
        const bnBtn = document.getElementById("scheduleTabBnBtn");
        const enBtn = document.getElementById("scheduleTabEnBtn");
        if (!bnContainer || !enContainer) return;

        if (view === "en") {
            loadEnglishSchedule();
            bnContainer.classList.add("hidden");
            enContainer.classList.remove("hidden");

            // Swipe / fade animation for switching to English
            enContainer.classList.add("opacity-0", "translate-x-3");
            requestAnimationFrame(() => {
                enContainer.classList.remove("opacity-0", "translate-x-3");
            });

            if (bnBtn) {
                bnBtn.className = "px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-violet-900 transition cursor-pointer";
            }
            if (enBtn) {
                enBtn.className = "px-3 py-1.5 rounded-lg font-bold transition bg-white text-violet-900 shadow-xs cursor-pointer";
            }
        } else {
            loadSchedule();
            enContainer.classList.add("hidden");
            bnContainer.classList.remove("hidden");

            // Swipe / fade animation for switching to Bangla
            bnContainer.classList.add("opacity-0", "-translate-x-3");
            requestAnimationFrame(() => {
                bnContainer.classList.remove("opacity-0", "-translate-x-3");
            });

            if (bnBtn) {
                bnBtn.className = "px-3 py-1.5 rounded-lg font-bold transition bg-white text-violet-900 shadow-xs cursor-pointer";
            }
            if (enBtn) {
                enBtn.className = "px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:text-violet-900 transition cursor-pointer";
            }
        }
    };

    /**
     * Schedule Swipe Gestures:
     * Explicitly disabled to allow users to smoothly scroll the wide schedule table left-to-right 
     * and right-to-left without inadvertently triggering language switches.
     */
    function initScheduleSwipeGestures() {
        // No-op: Table horizontal scroll is fully preserved for natural column inspection
    }

    /**
     * Filter Schedule Table by search keyword
     */
    window.filterScheduleTable = function(query) {
        const q = (query || "").trim().toLowerCase();
        const tables = document.querySelectorAll("#scheduleFragment table, #scheduleEnglishContainer table");
        tables.forEach(table => {
            const rows = table.querySelectorAll("tbody tr, tr:not(:first-child):not(:nth-child(2))");
            rows.forEach(row => {
                if (row.querySelector("th")) return;
                const text = row.textContent.toLowerCase();
                if (!q || text.includes(q)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    };

    window.loadSchedule = loadSchedule;
    window.loadEnglishSchedule = loadEnglishSchedule;
    window.renderEnglishSchedule = renderEnglishSchedule;
    window.updateScheduleOfflineBadge = updateScheduleOfflineBadge;

    window.HstuSchedule = {
        data: HSTU_SCHEDULE_DATA,
        renderScheduleBangla: function(containerId) {
            const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
            if (container) renderBanglaFallback(container);
        },
        renderScheduleEnglish: function(containerId) {
            const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
            if (container) renderEnglishFallback(container);
        },
        loadSchedule: loadSchedule,
        loadEnglishSchedule: loadEnglishSchedule,
        switchScheduleView: window.switchScheduleView,
        isOffline: () => !navigator.onLine
    };

    // Monitor connectivity changes to dynamically update schedule badge
    window.addEventListener("online", () => {
        updateScheduleOfflineBadge(false, true);
    });
    window.addEventListener("offline", () => {
        updateScheduleOfflineBadge(true, true);
    });

    // Auto-initialize when DOM is ready
    function initSchedule() {
        initScheduleSwipeGestures();
        // Preload both schedules immediately so switching between views is instantaneous with zero lag
        loadSchedule();
        loadEnglishSchedule();

        const currentLang = window.currentLang || (typeof localStorage !== 'undefined' && localStorage.getItem('hstu_bus_lang')) || 'bn';
        if (currentLang === 'en') {
            window.switchScheduleView('en');
        } else {
            window.switchScheduleView('bn');
        }
        updateScheduleOfflineBadge(!navigator.onLine, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSchedule);
    } else {
        initSchedule();
    }
})();
