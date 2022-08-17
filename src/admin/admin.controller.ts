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
  
  
  @ApiTags('Admin')
  @Controller('admin')
  export class AdminController {
    constructor(
      private readonly adminService: AdminService,
      private authService : AuthService
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
  
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
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
  
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    findAll() {
      return this.adminService.findAll();
    }
  
    @Get('get-one/:id')
    findOne(@Param('id') id: string) {
      return this.adminService.findOne(+id);
    }
  
    // @Patch(':id')
    // update(
    //   @Param('id') id: string,
    //   @Body() updateAdminDto: UpdateAdminDto,
    // ) {
    //   return this.adminService.update(+id, updateAdminDto);
    // }
  
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/delete-admin')
    remove(@Request() req) {
      return this.adminService.remove(req.token.email);
    }
  }
  