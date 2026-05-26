"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IcsService = void 0;
const common_1 = require("@nestjs/common");
const date_util_1 = require("../common/utils/date.util");
let IcsService = class IcsService {
    generateIcs(booking) {
        const eventDate = booking.eventDate;
        const [startHour, startMin] = booking.eventStartTime.split(':').map(Number);
        const [endHour, endMin] = booking.eventEndTime.split(':').map(Number);
        const dtStart = new Date(eventDate);
        dtStart.setHours(startHour, startMin, 0, 0);
        const dtEnd = new Date(eventDate);
        dtEnd.setHours(endHour, endMin, 0, 0);
        const now = new Date();
        const uid = `booking-${booking.id}@mua-studio`;
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//MUA Studio//Booking System//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${(0, date_util_1.formatDateForCalendar)(now)}`,
            `DTSTART:${(0, date_util_1.formatDateForCalendar)(dtStart)}`,
            `DTEND:${(0, date_util_1.formatDateForCalendar)(dtEnd)}`,
            `SUMMARY:MUA Booking - ${booking.service.name} - ${booking.customer.name}`,
            `DESCRIPTION:Booking ID: ${booking.id}\\nKlien: ${booking.customer.name}\\nHP: ${booking.customer.phone}\\nLayanan: ${booking.service.name}`,
            `LOCATION:${booking.eventLocation ?? ''}${booking.eventAddress ? ', ' + booking.eventAddress : ''}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ];
        return lines.join('\r\n');
    }
};
exports.IcsService = IcsService;
exports.IcsService = IcsService = __decorate([
    (0, common_1.Injectable)()
], IcsService);
//# sourceMappingURL=ics.service.js.map