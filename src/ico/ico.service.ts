import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateHotWalletICODTO } from './dto/ico-tsx.dto';
import { UpdateHotWalletICODTO } from './dto/update-ico-tsx.dto';
import { HotWalletICO } from './entity/hot-wallet.ico.entity';
const multichainWallet = require('multichain-crypto-wallet');
const Web3 = require('web3');

@Injectable()
export class ICOService {
  web3: any;
  constructor(
    @InjectRepository(HotWalletICO)
    private icoTsxsRepository: Repository<HotWalletICO>,
    private configService: ConfigService,
  ) {
    this.web3 = new Web3(
      'https://eth-goerli.g.alchemy.com/v2/G9aSmHyq0pCXRyGxOeC93wEDoxNiHCSj',
    );
  }

  async claimCoins(tsxHash: string, eth_address: string) {
    let tokenRecieved: number;
    let tsx_hash;
    const details = await this.web3.eth.getTransactionReceipt(tsxHash);
    // console.log(details);

    // Checking the tsx hash belongs to transfer function or not
    if (
      details.logs[0].topics[0] !=
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // keccak hash of transfer function
    ) {
      throw new HttpException(
        'Transaction hash is not of Transfer Function',
        HttpStatus.BAD_REQUEST,
      );
    }

    // checking is the reciever is vadiVault or not
    if (
      '0x' +
        this.web3.utils
          .stripHexPrefix(details.logs[0].topics[2])
          .slice(24)
          .toLowerCase() !=
      '0x0dEc5A633dD6f91084Bc257f80BA29a4e9ed1Bb0'.toLocaleLowerCase()
    ) {
      throw new HttpException(
        'The recieving address is not ours.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Checking is the sender is the correct
    if (
      '0x' +
        this.web3.utils
          .stripHexPrefix(details.logs[0].topics[1])
          .slice(24)
          .toLowerCase() !=
      eth_address.toLowerCase()
    ) {
      throw new HttpException(
        'This transaction hash does not belongs to you',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Checking which token we got
    // a) USDC ( use USDC contract address )
    if (
      details.to.toLowerCase() ==
      '0x4d3e38193c9f2392C0c9C79c7D62aDB9Af1c9683'.toLowerCase()
    ) {
      const [transaction] = await this.icoTsxsRepository.find({
        where: {
          recieved_token_tsx_hash: tsxHash,
        },
      });

      if (transaction && transaction.tsx_status == 'Completed') {
        throw new HttpException(
          'Vadi Coins are already claimed for this TSX Hash',
          HttpStatus.BAD_REQUEST,
        );
      }
      tokenRecieved =
        this.web3.utils.hexToNumberString(details.logs[0].data) / 10 ** 6;
      // divide by  10 ** decimal

      tsx_hash = await this.transferVadiCoins(eth_address, 20 * tokenRecieved);
      const status = await this.checkTransactionStatus(tsx_hash);
      if (status == '"1"') {
        const icoTsx = {
          recieved_token_tsx_hash: tsxHash,
          recieved_token_amount: tokenRecieved,
          users_eth_address: eth_address,
          recieved_token_name: 'USDC',
          tsx_status: 'Completed',
          vadi_coin_amount: 20 * tokenRecieved,
          vadi_coins_transfered: true,
          vadi_coin_transfer_tsx_hash: tsx_hash,
        };

        await this.createTsx(icoTsx);
      }

      return tsx_hash;
    }
  }

  async transferVadiCoins(address, amount) {
    // Transferring ERC20 tokens from one address to another.
    const transfer = await multichainWallet.transfer({
      recipientAddress: address,
      amount: amount,
      network: 'ethereum',
      rpcUrl: this.configService.get<string>('GOERLI_RPC'),
      privateKey: this.configService.get<string>('ADMIN_PRIVATE_KEY'),
      gasPrice: '100', // Gas price is in Gwei. leave empty to use default gas price
      tokenAddress: this.configService.get<string>(
        'VADI_COIN_TRANSPARENT_CONTRACT_ADDRESS',
      ),
    });

    

    return transfer.hash;
  }

  //// Repository Methods

  // Record Transactions
  async createTsx(createIcoTsx: CreateHotWalletICODTO) {
    const recieved_token_tsx_hash = createIcoTsx.recieved_token_tsx_hash;

    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash,
      },
    });

    if (tsx)
      throw new HttpException('Duplicate Hash Found', HttpStatus.BAD_REQUEST);

    const transaction = await this.icoTsxsRepository.create(createIcoTsx);
    const savedTsx = await this.icoTsxsRepository.save(transaction);
    return savedTsx;
  }

  // Update Transaction
  async updateTsx(updateTsxDto: UpdateHotWalletICODTO) {
    const tsx = await this.findByRecievedTsxHash(
      updateTsxDto.recieved_token_tsx_hash,
    );
    const keys = Object.keys(updateTsxDto);
    keys.forEach((key) => {
      tsx[key] = updateTsxDto[key];
    });

    const savedTsx = await this.icoTsxsRepository.save(tsx);
    return savedTsx;
  }

  // Find by recieved transaction hash
  async findByRecievedTsxHash(hash: string) {
    const [tsx] = await this.icoTsxsRepository.find({
      where: {
        recieved_token_tsx_hash: hash,
      },
    });

    if (!tsx) throw new NotFoundException('ICO Tsx does not exists.');
    return tsx;
  }

  ///// BlockChain Transaction
  // Check Transaction status
  async checkTransactionStatus(hash: string) {
    const config = {
      method: 'get',
      url: `https://api-goerli.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${this.configService.get<string>(
        'ETHERSCAN_API_KEY',
      )}`,
      headers: {},
    };

    const status = await axios(config)
      .then(function (response) {
        return JSON.stringify(response.data.status);
      })
      .catch(function (error) {
        console.log(' gvfgsd;vj', error);
      });

    let value: string;
    if (typeof status == 'string') value = status;

    return value;
  }
}
