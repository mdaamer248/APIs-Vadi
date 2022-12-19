import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { InvestorService } from './investor.service';
import { AuthService } from './auth.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { LoginInvestorDto } from './dto/login-investor.dto';
import { ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import { InvestorGuard } from 'src/guards/investor.guard';
import { OTPDto } from './dto/otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordDto } from './dto/password.dto';
import { MissingJoinTableError } from 'typeorm';
import { MobileDto } from './dto/mobile.dto';
import { SmsOtpDto } from './dto/smsotp.dto';

@ApiTags('Investor')
@Controller()
export class InvestorController {
  constructor(
    private readonly investorService: InvestorService,
    private authService: AuthService
  ) {}

  @Post('auth/signup')
  async signup(@Body() createInvestorDto: CreateInvestorDto) {
    const investor = await this.authService.signup(createInvestorDto);
    return investor;
  }

  @Post('auth/signin')
  async signin(@Body() loginInvestorDto: LoginInvestorDto) {
    const investor = await this.authService.signin(
      loginInvestorDto.email,
      loginInvestorDto.password,
    );
    return investor;
  }

  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Post('/investor/validate-password/:email')
  async validatePassword(@Param('email') email:string, @Body() data: PasswordDto){
    const response = await this.authService.validatePassword(email, data.password);
    return response;
  }

  @Post('/investor/token-subscription/:email')
  async tokenSubscription(@Param('email') email:string){
    const response = await this.authService.tokenSubscription(email);
    return response;
  }

  @Get('get-password-reset-link/:email')
  getPasswordResetLink(@Param('email') email: string) {
    console.log(email);
    return this.authService.sendUserPasswordResetMail(email);
  }

  //@ApiBearerAuth()
  //@UseGuards(InvestorGuard)
  @Post('reset-password')
  changeYourPassword(@Body() body: ResetPasswordDto) {
    //if (req.token.email != body.email) throw new BadRequestException();
   // const resetToken = req.headers.authorization.split(' ')[1];
    return this.authService.resetPassword(
      body.email,
      body.newPassword,
    );
  }

  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Get('auth/resendOTP/:email')
  generateOTP(@Param('email') email: string) {
    console.log(email);
    // console.log(req.token.email);
    return this.authService.getOTP(email);
  }

  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Post('verifyOTP')
  submitOTP(@Body() data: OTPDto) {
    //console.log(req.token.email);
    return this.authService.submitOTP(
      data.email,
      data.otp
    );
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get('investor')
  findAll() {
    return this.investorService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get('investorByEmail')
  findByEmail(@Request() req) {
    return this.investorService.findByEmail(req.token.email)
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.investorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvestorDto: UpdateInvestorDto,
  ) {
    return this.investorService.update(+id, updateInvestorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investorService.remove(+id);
  }
  @Post('sendOTP')
    sendtOTP(@Body() phone: MobileDto) {
    return this.investorService.sendOTP(phone);
  }

  @Post('verifySmsOTP')
  verifyOTP(@Body() data: SmsOtpDto) {
    return this.investorService.verifyOTP(data.mobile,data.otp);
  }
  @Get('coins/marketdata')
  coins() {
    return this.investorService.marketdata();
  }

  @Get('wallet-coins/marketdata')
  walletCoins() {
    return this.investorService.walletMarketdata();
  }

  @Get('inv/:email')
  async getInvestorByEmail(@Param('email') email: string){
    const investor = await this.investorService.findByEmail(email);
    return investor;
  }
}
