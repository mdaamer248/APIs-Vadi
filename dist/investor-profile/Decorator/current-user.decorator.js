"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentInvestor = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
exports.CurrentInvestor = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
        return false;
    }
    const auth = request.headers.authorization;
    if (auth.split(' ')[0] !== 'Bearer') {
        return false;
    }
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (err) {
        if (err.name == ' TokenExpiredError') {
            throw new common_2.HttpException(err.name, common_2.HttpStatus.NOT_ACCEPTABLE);
        }
        const message = 'Token error: ' + (err.message || err.name);
        throw new common_2.HttpException(message, common_2.HttpStatus.FORBIDDEN);
    }
});
//# sourceMappingURL=current-user.decorator.js.map