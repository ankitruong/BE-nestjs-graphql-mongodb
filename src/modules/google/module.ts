import { Module } from '@nestjs/common';
import { UserModule } from '../user/module';
import { GGController } from './controller';

import { GGService } from './service';

@Module({
  imports: [UserModule],
  controllers: [GGController],
  providers: [GGService],
})
export class GGModule {}
