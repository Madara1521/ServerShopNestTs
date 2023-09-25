import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { ShoesModule } from 'src/shoes/shoes.module';
import { ShoesService } from 'src/shoes/shoes.service';

describe('Shoes service', () => {
  let app: INestApplication;
  let shoesService: ShoesService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        ShoesModule,
      ],
    }).compile();

    shoesService = testModule.get<ShoesService>(ShoesService);
    app = testModule.createNestApplication();

    await app.init();
  });

  it('should find by id', async () => {
    const shoe = await shoesService.findOne(1);

    expect(shoe.dataValues).toEqual(
      expect.objectContaining({
        id: 1,
        shoes_manufacturer: expect.any(String),
        price: expect.any(Number),
        country_maufacturer: expect.any(String),
        vendor_code: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        images: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        compatibility: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should find by name', async () => {
    const shoe = await shoesService.findOneByName('Illum reprehenderit.');

    expect(shoe.dataValues).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        shoes_manufacturer: expect.any(String),
        price: expect.any(Number),
        country_maufacturer: expect.any(String),
        vendor_code: expect.any(String),
        name: 'Illum reprehenderit.',
        description: expect.any(String),
        images: expect.any(String),
        in_stock: expect.any(Number),
        bestseller: expect.any(Boolean),
        new: expect.any(Boolean),
        popularity: expect.any(Number),
        compatibility: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should find by search string', async () => {
    const shoes = await shoesService.searchByString('nos');

    expect(shoes.rows.length).toBeLessThanOrEqual(20);
    shoes.rows.forEach((item) => {
      expect(item.name.toLowerCase()).toContain('nos');
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          shoes_manufacturer: expect.any(String),
          price: expect.any(Number),
          country_maufacturer: expect.any(String),
          vendor_code: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          images: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: expect.any(Boolean),
          popularity: expect.any(Number),
          compatibility: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should find by bestsellers', async () => {
    const shoes = await shoesService.bestsellers();

    shoes.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          shoes_manufacturer: expect.any(String),
          price: expect.any(Number),
          country_maufacturer: expect.any(String),
          vendor_code: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          images: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: true,
          new: expect.any(Boolean),
          popularity: expect.any(Number),
          compatibility: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  it('should find new parts', async () => {
    const shoes = await shoesService.new();

    shoes.rows.forEach((item) => {
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          shoes_manufacturer: expect.any(String),
          price: expect.any(Number),
          country_maufacturer: expect.any(String),
          vendor_code: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          images: expect.any(String),
          in_stock: expect.any(Number),
          bestseller: expect.any(Boolean),
          new: true,
          popularity: expect.any(Number),
          compatibility: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
