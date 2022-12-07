import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import * as jwt from 'jsonwebtoken';
  
  @Injectable()
  export class InvestorGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
      if (!request.headers.authorization) {
        return false;
      }
      request.token = await this.validateToken(request.headers.authorization);
      if (request.token.isInvestor !== true) return false;

      return true;
    }
  
    async validateToken(auth: string) {
      if (auth.split(' ')[0] !== 'Bearer') {
        return false;
      }
      const token = auth.split(' ')[1];
      try {
        const decoded = jwt.verify(token,'HI There!');
        // console.log(decoded);
        return decoded;
      } catch (err) {
        if (err.name == ' TokenExpiredError') {
          throw new HttpException(err.name, HttpStatus.NOT_ACCEPTABLE);
        }
        const message = 'Token error: ' + (err.message || err.name);
        throw new HttpException(message, HttpStatus.FORBIDDEN);
      }
    }
  }
  