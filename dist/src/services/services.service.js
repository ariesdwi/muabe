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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(includeInactive = false) {
        return this.prisma.service.findMany({
            where: includeInactive ? {} : { status: client_1.ServiceStatus.ACTIVE },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findBySlug(slug) {
        const service = await this.prisma.service.findUnique({ where: { slug } });
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        return service;
    }
    async findById(id) {
        const service = await this.prisma.service.findUnique({ where: { id } });
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        return service;
    }
    async create(dto) {
        const slug = slugify(dto.name);
        const existing = await this.prisma.service.findUnique({ where: { slug } });
        if (existing)
            throw new common_1.BadRequestException('Service with this name already exists');
        return this.prisma.service.create({
            data: {
                ...dto,
                slug,
            },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.service.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.service.update({
            where: { id },
            data: { status: client_1.ServiceStatus.INACTIVE },
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map