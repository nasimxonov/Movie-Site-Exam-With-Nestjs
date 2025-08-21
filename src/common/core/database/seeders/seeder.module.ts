import { Module } from '@nestjs/common';
import { SeederService } from './sedeer.service';

@Module({
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
