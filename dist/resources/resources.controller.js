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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
let ResourcesController = class ResourcesController {
    getFile(res) {
        const file = (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'whitepaper-vadi-v1.1.pdf'));
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="whitepaper-vadi-v1.1.pdf"',
        });
        return new common_1.StreamableFile(file);
    }
};
__decorate([
    (0, common_1.Get)('/get/white_paper_pdf'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", common_1.StreamableFile)
], ResourcesController.prototype, "getFile", null);
ResourcesController = __decorate([
    (0, swagger_1.ApiTags)('Resources'),
    (0, common_1.Controller)('resources')
], ResourcesController);
exports.ResourcesController = ResourcesController;
//# sourceMappingURL=resources.controller.js.map