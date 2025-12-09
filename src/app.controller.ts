import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {DecryptionDTO, EncryptionDTO} from "./model/app.dto";

@Controller('api/docs')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('get-encrypt-data')
  async genEncryption(@Body() body:EncryptionDTO ) {
    return (await this.appService.getEncryptionService(body))?.build();
  }

  @Post('get-decrypt-data')
  async decryptionData(@Body() body:DecryptionDTO ) {
    return (await this.appService.decryptionService(body))?.build();
  }
}
