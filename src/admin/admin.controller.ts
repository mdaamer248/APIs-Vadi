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
  import { ApiTags, ApiBearerAuth} from '@nestjs/swagger';
  import { AdminGuard } from 'src/guards/admin.guard';
  import { AdminService } from './admin.service';
  import { AuthService } from './admin.auth.service';
  import { CreateAdminDto } from './dto/create-admin.dto';
  import { UpdateAdminDto } from './dto/update-admin.dto';
  import { LoginAdminDto } from './dto/login-admin.dto';
  import { ResetPasswordDto } from './dto/resetpoasswird.dto';
  //import { AuthService } from 'src/investor/auth.service';
  import { CreateInvestorDto } from 'src/investor/dto/create-investor.dto';
  import { CreateInvestorProfileDto } from 'src/investor-profile/dto/create-investor-profile.dto';
import { InvestorProfileService } from 'src/investor-profile/investor-profile.service';


  
  @ApiTags('Admin')
  @Controller('admin')
  export class AdminController {
    constructor(
      private readonly adminService: AdminService,
      private authService : AuthService,
      private investorProfileService: InvestorProfileService,

    ) {}
  
    @Post('auth/signup')
    async signup(@Body() createAdminDto: CreateAdminDto) {
      const admin = await this.authService.signup(createAdminDto);
      return admin;
    }
  
    @Post('auth/signin')
    async signin(@Body() loginAdminDto: LoginAdminDto) {
      const admin = await this.authService.signin(
        loginAdminDto.email,
        loginAdminDto.password,
      );
      return admin;
    }
    
    @Get('get-password-reset-link/:email')
    getPasswordResetLink(@Param('email') email: string) {
      return this.authService.sendUserPasswordResetMail(email);
    }
  
    //@ApiBearerAuth()
    //@UseGuards(AdminGuard)
    @Post('reset-password/')
    changeYourPassword(@Body() body: ResetPasswordDto) {
      //if (req.token.email != body.email) throw new BadRequestException();
      //const resetToken = req.headers.authorization.split(' ')[1];
      return this.authService.resetPassword(
        body.email,
        body.newPassword,
      );
    }
  
    //@ApiBearerAuth()
    //@UseGuards(AdminGuard)
    @Get()
    findAll() {
      return this.adminService.findAll();
    }
  
    // @Get('get-one/:id')
    // findOne(@Param('id') id: string) {
    //   return this.adminService.findOne(+id);
    // }
    @Post('investor-registration')
    async investorSignup(@Body() createInvestorDto: CreateInvestorDto) {
      const investor = await this.authService.investorSignup(createInvestorDto);
      return investor;
    }

    @Post('create-investor-profile/:email')
    create(@Body() createInvestorProfileDto: CreateInvestorProfileDto,@Param('email') email: string) {
    //const email = req.token.email;
    return this.investorProfileService.create(createInvestorProfileDto,email);
  }

    @Get('/investorslist')
    findAllInvestors() {
      return this.adminService.findAllInvestors();
    }
    @Delete('/delete-investor/:email')
    removeInvestor(@Param('email') email:string) {
      return this.adminService.removeInvestor(email);
    }
  
    // @Patch(':id')
    // update(
    //   @Param('id') id: string,
    //   @Body() updateAdminDto: UpdateAdminDto,
    // ) {
    //   return this.adminService.update(+id, updateAdminDto);
    // }
  
    //@ApiBearerAuth()
    //@UseGuards(AdminGuard)
    @Delete('/delete-admin/:email')
    remove(@Param('email') email:string) {
      return this.adminService.remove(email);
    }
  }
  