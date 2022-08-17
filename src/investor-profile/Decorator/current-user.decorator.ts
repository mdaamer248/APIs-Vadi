import { createParamDecorator , ExecutionContext } from "@nestjs/common"; 
import {HttpException, HttpStatus} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const CurrentInvestor = createParamDecorator( (data: never, context: ExecutionContext) =>{
const request = context.switchToHttp().getRequest();
if (!request.headers.authorization) {
  return false;
}

const auth = request.headers.authorization;
if (auth.split(' ')[0] !== 'Bearer') {
    return false;
    // throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
  }
  const token = auth.split(' ')[1];
    //  console.log(token);
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decoded)
    return decoded;
  } catch (err) {
    if (err.name == ' TokenExpiredError') {
      throw new HttpException(err.name, HttpStatus.NOT_ACCEPTABLE);
    }
    const message = 'Token error: ' + (err.message || err.name);
    throw new HttpException(message, HttpStatus.FORBIDDEN);
  }
})



