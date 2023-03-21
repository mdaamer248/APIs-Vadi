"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModule = void 0;
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const wallet_controller_1 = require("./wallet.controller");
const bnb_controller_1 = require("./blockChains/Binance/bnb.controller");
const btc_controller_1 = require("./blockChains/bitcoin/btc.controller");
const eth_controller_1 = require("./blockChains/etherium/eth.controller");
const mtc_controller_1 = require("./blockChains/polygon/mtc.controller");
const sol_controller_1 = require("./blockChains/solana/sol.controller");
const vadicoin_controller_1 = require("./blockChains/vadiCoin/vadicoin.controller");
const config_1 = require("@nestjs/config");
const bnb_service_1 = require("./blockChains/Binance/bnb.service");
const btc_service_1 = require("./blockChains/bitcoin/btc.service");
const eth_service_1 = require("./blockChains/etherium/eth.service");
const mtc_service_1 = require("./blockChains/polygon/mtc.service");
const sol_service_1 = require("./blockChains/solana/sol.service");
const vadicoin_service_1 = require("./blockChains/vadiCoin/vadicoin.service");
const investor_module_1 = require("../investor/investor.module");
const typeorm_1 = require("@nestjs/typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
let WalletModule = class WalletModule {
};
WalletModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wallet_entity_1.Wallet]), investor_module_1.InvestorModule],
        controllers: [
            wallet_controller_1.WalletController,
            vadicoin_controller_1.VdcController,
            eth_controller_1.EthController,
            bnb_controller_1.BnbController,
            mtc_controller_1.MtcController,
            sol_controller_1.SolController,
            btc_controller_1.BtcController,
        ],
        providers: [
            wallet_service_1.WalletService,
            config_1.ConfigService,
            eth_service_1.EthService,
            sol_service_1.SolService,
            btc_service_1.BtcService,
            bnb_service_1.BnbService,
            mtc_service_1.MtcService,
            vadicoin_service_1.VdcService,
        ],
        exports: [vadicoin_service_1.VdcService]
    })
], WalletModule);
exports.WalletModule = WalletModule;
//# sourceMappingURL=wallet.module.js.map