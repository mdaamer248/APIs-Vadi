import { CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
export declare class InvestorGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateToken(auth: string): Promise<string | false | jwt.JwtPayload>;
}
