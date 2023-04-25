"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestorProfileModule = void 0;
const common_1 = require("@nestjs/common");
const investor_profile_service_1 = require("./investor-profile.service");
const investor_profile_controller_1 = require("./investor-profile.controller");
const typeorm_1 = require("@nestjs/typeorm");
const investor_profile_entity_1 = require("./entities/investor-profile.entity");
const platform_express_1 = require("@nestjs/platform-express");
const investor_module_1 = require("../investor/investor.module");
let InvestorProfileModule = class InvestorProfileModule {
};
InvestorProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([investor_profile_entity_1.InvestorProfile]),
            platform_express_1.MulterModule.register({
                dest: './files',
            }),
            investor_module_1.InvestorModule
        ],
        controllers: [investor_profile_controller_1.InvestorProfileController],
        providers: [investor_profile_service_1.InvestorProfileService],
    })
], InvestorProfileModule);
exports.InvestorProfileModule = InvestorProfileModule;
//# sourceMappingURL=investor-profile.module.js.map