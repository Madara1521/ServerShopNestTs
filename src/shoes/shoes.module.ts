import { Module } from '@nestjs/common';
import { ShoesController } from './shoes.controller';
import { ShoesService } from './shoes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shoes } from './shoes.model';

@Module({
  imports: [SequelizeModule.forFeature([Shoes])],
  controllers: [ShoesController],
  providers: [ShoesService],
  exports: [ShoesService],
})
export class ShoesModule {}
