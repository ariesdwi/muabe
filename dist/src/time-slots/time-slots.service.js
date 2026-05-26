"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TimeSlotsService = class TimeSlotsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(onlyActive = false) {
        return this.prisma.timeSlot.findMany({
            where: onlyActive ? { isActive: true } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { startTime: 'asc' }],
        });
    }
    async create(dto) {
        return this.prisma.timeSlot.create({ data: dto });
    }
    async toggle(id) {
        const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
        if (!slot)
            throw new common_1.NotFoundException('Time slot not found');
        return this.prisma.timeSlot.update({
            where: { id },
            data: { isActive: !slot.isActive },
        });
    }
    async update(id, dto) {
        const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
        if (!slot)
            throw new common_1.NotFoundException('Time slot not found');
        return this.prisma.timeSlot.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
        if (!slot)
            throw new common_1.NotFoundException('Time slot not found');
        return this.prisma.timeSlot.delete({ where: { id } });
    }
};
exports.TimeSlotsService = TimeSlotsService;
exports.TimeSlotsService = TimeSlotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimeSlotsService);
//# sourceMappingURL=time-slots.service.js.map