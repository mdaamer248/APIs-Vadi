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

// @ApiTags('Investor')
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

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('/auth/validate-password')
  async validatePassword(@Request() req, @Body() data: PasswordDto){
    const response = await this.authService.validatePassword(req.token.email, data.password);
    return response;
  }

  @Get('get-password-reset-link/:email')
  getPasswordResetLink(@Param('email') email: string) {
    console.log(email);
    return this.authService.sendUserPasswordResetMail(email);
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('reset-password')
  changeYourPassword(@Request() req, @Body() body: ResetPasswordDto) {
    if (req.token.email != body.email) throw new BadRequestException();
    const resetToken = req.headers.authorization.split(' ')[1];
    return this.authService.resetPassword(
      resetToken,
      req.token.email,
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
      data.otp,
      data.timeStamp,
    );
  }

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Get()
  findAll() {
    return this.investorService.findAll();
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
}
