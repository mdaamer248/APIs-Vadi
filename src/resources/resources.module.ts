import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';

@Module({
  imports: [],
  controllers: [ResourcesController],
  providers: [],
})
export class ResourcesModule {}
