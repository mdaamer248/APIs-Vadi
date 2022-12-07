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
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendCoinDto } from 'src/wallet/dto/send-coin.dto';
import { InvestorGuard } from 'src/guards/investor.guard';
import { SolService } from './sol.service';

@ApiTags('Solana (Dev-net)')
@Controller('sol')
export class SolController {
  constructor(private readonly solService: SolService) {}

  @ApiBearerAuth()
  @UseGuards(InvestorGuard)
  @Post('send/sol')
  async sendEth(@Request() req, @Body() sendSolDto: SendCoinDto) {
    const tsx = await this.solService.sendSol(req.token.email, sendSolDto);
    return tsx;
  }
}
