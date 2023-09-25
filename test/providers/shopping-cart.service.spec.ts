import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import { ShoesModule } from 'src/shoes/shoes.module';
import { ShoesService } from 'src/shoes/shoes.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service';

const mockedUser = {
  username: 'Madara1521',
  email: 'madara1521@gmail.com',
  password: 'madara123',
};

describe('Shopping Cart Service', () => {
  let app: INestApplication;
  let shoesService: ShoesService;
  let usersService: UsersService;
  let shoppingCartService: ShoppingCartService;

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
        ShoppingCartModule,
        ShoesModule,
      ],
    }).compile();

    shoesService = testModule.get<ShoesService>(ShoesService);
    usersService = testModule.get<UsersService>(UsersService);
    shoppingCartService =
      testModule.get<ShoppingCartService>(ShoppingCartService);

    app = testModule.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    const user = new User();

    const heshedPassword = await bcrypt.hash(mockedUser.password, 10);

    user.username = mockedUser.username;
    user.password = heshedPassword;
    user.email = mockedUser.email;

    return user.save();
  });

  beforeEach(async () => {
    const cart = new ShoppingCart();
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });
    const product = await shoesService.findOne(1);

    cart.userId = user.id;
    cart.productId = product.id;
    cart.shoes_manufacturer = product.shoes_manufacturer;
    cart.country_maufacturer = product.country_maufacturer;
    cart.price = product.price;
    cart.in_stock = product.in_stock;
    cart.image = JSON.parse(product.images)[0];
    cart.name = product.name;
    cart.total_price = product.price;

    return cart.save();
  });

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
    await ShoppingCart.destroy({ where: { productId: 1 } });
  });

  it('should return all cart items', async () => {
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shoppingCartService.findAll(user.id);

    cart.forEach((item) =>
      expect(item.dataValues).toEqual(
        expect.objectContaining({
          userId: user.id,
          productId: expect.any(Number),
          price: expect.any(Number),
          in_stock: expect.any(Number),
          count: expect.any(Number),
          total_price: expect.any(Number),
          id: expect.any(Number),
          shoes_manufacturer: expect.any(String),
          country_maufacturer: expect.any(String),
          image: expect.any(String),
          name: expect.any(String),
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
        }),
      ),
    );
  });

  it('should add cart items', async () => {
    await shoppingCartService.add({
      username: mockedUser.username,
      productId: 3,
    });
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.find((item) => item.productId === 3)).toEqual(
      expect.objectContaining({
        userId: user.id,
        productId: 3,
        price: expect.any(Number),
        in_stock: expect.any(Number),
        count: expect.any(Number),
        total_price: expect.any(Number),
        id: expect.any(Number),
        shoes_manufacturer: expect.any(String),
        country_maufacturer: expect.any(String),
        image: expect.any(String),
        name: expect.any(String),
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      }),
    );
  });

  it('should add return updated count', async () => {
    const result = await shoppingCartService.updateCount(2, 1);

    expect(result).toEqual({ count: 2 });
  });

  it('should add return updated total price', async () => {
    const shoes = await shoesService.findOne(1);
    const result = await shoppingCartService.updateTotalPrice(
      shoes.price * 3,
      1,
    );

    expect(result).toEqual({ total_price: shoes.price * 3 });
  });

  it('should delete cart item', async () => {
    await shoppingCartService.remove(1);

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart.find((item) => item.productId === 1)).toBeUndefined();
  });

  it('should delete all cart item', async () => {
    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    await shoppingCartService.removeAll(user.id);

    const cart = await shoppingCartService.findAll(user.id);

    expect(cart).toStrictEqual([]);
  });
});
