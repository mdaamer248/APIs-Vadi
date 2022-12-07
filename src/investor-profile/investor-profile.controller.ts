import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { InvestorProfileService } from './investor-profile.service';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto';
import { ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import { GetByEmailDto } from './dto/get-by-email.dto';
import { UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentInvestor } from './Decorator/current-user.decorator';
import { IdNumberDto } from './dto/id-number.dto';
import { storage } from './utils/file-storage.utils';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import { InvestorGuard } from 'src/guards/investor.guard';



@ApiTags('Profile')
@Controller('profile')
export class InvestorProfileController {
  constructor(
    private readonly investorProfileService: InvestorProfileService,
  ) {}


  //Create Profile of Investor
  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Post('create/:email')
  create(@Body() createInvestorProfileDto: CreateInvestorProfileDto,@Param('email') email: string) {
    //const email = req.token.email;
    return this.investorProfileService.create(createInvestorProfileDto,email);
  }


  // Update idNumber of Investor
  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('update-idNumber')
  async updateIdNumber(@Body() data: IdNumberDto, @Request() req) {
    const email = req.token.email;
    const investorIdNumber = await this.investorProfileService.updateIdNumber(email, data.idNumber);
    return investorIdNumber;
  }


  // Get the level of Investor and other details related with funds
  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Get('get-investor-level')
  async getInvestorLevel(@Request() req) {
    const email = req.token.email;
    const investorLevelDetails = await this.investorProfileService.getInvestorLevel(email);
    return investorLevelDetails;
  }



  
  //Upload front side of documents
  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Post('file/upload/idFront/:email')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file,@Param('email') email: string) {
    //const email = req.token.email;
    const investorProfile = await this.investorProfileService.saveDoc(
      email,
      file.filename,
      'front',
    );
    return investorProfile;
  }


  //Upload Backside of Documents
  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Post('file/upload/idBackSide/:email')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFileBack(@UploadedFile() file, @Param('email') email: string) {
    //const email = req.token.email;
    const investorProfile = await this.investorProfileService.saveDoc(
      email,
      file.filename,
      'back',
    );
    return investorProfile;
  }


  //Upload proof of address
  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Post('file/upload/idAddress/:email')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFileAddress(@UploadedFile() file, @Param('email') email: string) {
    //const email = req.token.email;
    const investorProfile = await this.investorProfileService.saveDoc(
      email,
      file.filename,
      'address',
    );
    return investorProfile;
  }



  //Get the uploaded images
  // @ApiBearerAuth()
  // @UseGuards(InvestorGuard)
  @Get('profile-image/:imagename')
  async findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
    @Request() req,
  ): Promise<Observable<Object>> {
    const email = req.token.email;
    const imageName = await this.investorProfileService.getDocName(email,imagename)
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imageName)),
    );
  }



  @Get('get-all')
  findAll() {
    return this.investorProfileService.findAll();
  }

  @Post('get-by-email')
  getByEmail(@Body() data: GetByEmailDto) {
    return this.investorProfileService.findOne(data.email);
  }
}
