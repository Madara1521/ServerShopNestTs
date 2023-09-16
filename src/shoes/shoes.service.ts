import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Shoes } from './shoes.model';
import { IShoesQuery } from './types';

@Injectable()
export class ShoesService {
  constructor(
    @InjectModel(Shoes)
    private shoesModel: typeof Shoes,
  ) {}

  async paginateAndFilter(
    query: IShoesQuery,
  ): Promise<{ count: number; rows: Shoes[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;
    return this.shoesModel.findAndCountAll({
      limit,
      offset,
    });
  }

  async bestsellers(): Promise<{ count: number; rows: Shoes[] }> {
    return this.shoesModel.findAndCountAll({
      where: { bestseller: true },
    });
  }

  async new(): Promise<{ count: number; rows: Shoes[] }> {
    return this.shoesModel.findAndCountAll({
      where: { new: true },
    });
  }

  async findOne(id: number | string): Promise<Shoes> {
    return this.shoesModel.findOne({
      where: { id },
    });
  }

  async findOneByName(name: string): Promise<Shoes> {
    return this.shoesModel.findOne({
      where: { name },
    });
  }

  async searchByString(str: string): Promise<{ count: number; rows: Shoes[] }> {
    return this.shoesModel.findAndCountAll({
      limit: 20,
      where: { name: { [Op.like]: `%${str}%` } },
    });
  }
}
