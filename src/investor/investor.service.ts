import { Injectable } from '@nestjs/common';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { MobileDto } from './dto/mobile.dto';
import { SmsOtpDto } from './dto/smsotp.dto';
import { ConfigService } from '@nestjs/config';
import { In } from "typeorm";
import { count } from 'rxjs';
import { stringify } from 'querystring';

const Vonage = require('@vonage/server-sdk')

@Injectable()
export class InvestorService {
  private vonage
  constructor(
    @InjectRepository(Investor)
    private investorRepository: Repository<Investor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,)
   
    {
    this.vonage = new Vonage({
    apiKey: process.env.SMS_APIKEY,
    apiSecret: process.env.SMS_APISECRET

    //apiKey: configService.get<string>('SMS_APIKEY'),
    //apiSecret: configService.get<string>('SMS_APISECRET'),

    })
    }

  // Create the Investor and save it to the repository.
  async create(email: string, password: string) {
    try {
      const investor = {email, password};
      const newInvestor = this.investorRepository.create(investor);
      await this.investorRepository.save(newInvestor);
      return newInvestor;
    } catch (err) {
      console.log('Error creating user', err);
      throw new InternalServerErrorException();
    }
  }

  // Update the Investor and save it to Repository
  async update(id: number, updateInvestorDto: UpdateInvestorDto) {
    const {
      newPassword,
      newEmail,
      newUserName,
      profileImg,
      phone,
      newValidationCode,
      newOtpIssuedAt,
      newResetTokenIssuedAt,
      newIsConfirmed
    } = updateInvestorDto;
    const investor = await this.findOne(id);
    if (!investor)
      return { message: 'User not found' }

    if (newPassword) investor.password = newPassword;
    if (newEmail) investor.email = newEmail;
    if (newUserName) investor.userName = newUserName;
    if (newValidationCode) investor.validationCode = newValidationCode;
    if (profileImg) investor.profileImg = profileImg;
    if (phone) investor.phone = phone;

    if (newOtpIssuedAt) investor.otpIssuedAt = newOtpIssuedAt;
    //if (newResetToken)  investor.resetToken = newResetToken;
    if (newResetTokenIssuedAt) investor.resetTokenIssuedAt = newResetTokenIssuedAt;
    if (newIsConfirmed) investor.isConfirmed = true;

    await this.investorRepository.save(investor);
    return { statuscode:200 ,message: "User has been updated!"};
  }


  // Get all Investor
  async findAll() {
    const investors = await this.investorRepository.find();
    if (!investors) throw new NotFoundException();
    return investors;
  }


  // Find the Investor By Id
  async findOne(id: number) {
    const investor = await this.investorRepository.findOne({ where: { id } });
    if (!investor) throw new NotFoundException();
    return investor;
  }

  async sendOTP(dto:MobileDto){
    const { dailcode,mobile } = dto;
    const validationCode = Math.floor(Math.random() * 10000);
    const from = "Vonage APIs"
    //const dailcode = "91"
    const number = mobile
    const code = dailcode
    const to = `${code}` + number
    const text = `Your otp from Vadi is ${validationCode}`
    const data = new User()
    data.mobile = mobile,
    data.smsOtp = validationCode,
    data.dailCode = code
    //const newUser = this.userRepository.create(user);
      await this.userRepository.save(data);
     const result = await this.sendSMS(from, to, text)
        if (result['code'] === 200) {
          const message = result['message']
            return ({ code: 200, message })
        } else {
            const message = result['message']
            return ({ code: 201, message })
        }
    // this.vonage.message.sendSms(from, to, text, (err, responseData) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     if(responseData.messages[0]['status'] === "0") {
    //         console.log("Message sent successfully.");
    //         return{ code:200,message:"Otp sent successfully" }
    //     } else {
    //         console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
    //         return{ code:201, message:"Message failed"}
    //     }
    //   }
    // })
  }

  sendSMS = (from, to, text) =>
        new Promise((resolve, reject) => {
            this.vonage.message.sendSms(from, to, text, { "type": "unicode" }, (err, responseData) => {
                if (err) {
                    resolve({ code: 201, message: err })
                } else {
                    if (responseData.messages[0]['status'] === "0") {
                        resolve({ code: 200, message: "Message sent successfully." });
                    } else {
                        resolve({ code: 201, message: `Message failed with error: ${responseData.messages[0]['error-text']}` });
                    }
                }
            })
        })

  async verifyOTP(mobile:number,otp:number) {
    const investor = await this.userRepository.findOne({ where: { mobile } });

     if (investor.smsOtp != otp){
       return {code:201, message: 'Wrong OTP' }
     }else{
      return {code:200, message: 'Otp verified'}
     }

  }

  // Find the investor by Email
  find(email: string) {
    return this.investorRepository.find({ where: { email } });
  }

  // Delete the investor by Id
  remove(id: number) {
    return `This action removes a #${id} investor`;
  }
  async marketdata()
  {
    const request = require('request-promise');

    const options = {
      method: 'GET',
      uri: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'EN'

      }
    }

    var res = await request(options).then(function (response) {
      // console.log(response);
      return response
    })
      .catch(function (err) {
        return err
      })
      var list = ['BTC','ETH','LTC','USDT','USDC','SOL','MATIC','ADA','AVAX','FTM','BNB','ATOM','NEAR','ALGO','UNI','CAKE','AAVE','CRV'];
      var result=res.filter(item => list.includes(item.symbol.toUpperCase()))
      //console.log(result)
    return { message:"success",result}
  }

  async walletMarketdata()
  {
    const request = require('request-promise');

    const options = {
      method: 'GET',
      uri: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'EN'

      }
    }

    var res = await request(options).then(function (response) {
      return response
    })
      .catch(function (err) {
        return err
      })
      var list = ['ETH','SOL','MATIC','BNB'];
      var result=res.filter(item => list.includes(item.symbol.toUpperCase()))
    return { message:"success",result}
  }

  async Marketdatagraph(id:string)
  {
    const request = require('request-promise');

    const options = {
      method: 'GET',
      uri: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d`,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'EN'

      }
    }

    var res = await request(options).then(function (response) {
      //console.log(response)
      var myJsonString = JSON.stringify(response);
      
    
      return response
    })
      .catch(function (err) {
        return err
      })
    // var info = res.concat("description= 'test'")
    //    var infoo = Object.assign({},res,{property: "test"})
    return res
      }

      async pricegraph(id:string,from,to)
  {
    const request = require('request-promise');

    const options = {
      method: 'GET',
      uri: `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'accept-language': 'EN'

      }
    }

    var res = await request(options).then(function (response) {
      //console.log(response)
      var myJsonString = JSON.stringify(response);
      
    
      return response
    })
      .catch(function (err) {
        return err
      })
    return {prices: res.prices}
      }
}
