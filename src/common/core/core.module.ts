import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
})
export class CoreModule {}
