import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';
import { ShoesModule } from 'src/shoes/shoes.module';
import { ShoesService } from 'src/shoes/shoes.service';
import { UsersService } from 'src/users/users.service';
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model';
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module';

const mockedUser = {
  username: 'Madara1521',
  email: 'madara1521@gmail.com',
  password: 'madara123',
};

describe('Shopping Cart Controller', () => {
  let app: INestApplication;
  let shoesService: ShoesService;
  let usersService: UsersService;

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
        AuthModule,
      ],
    }).compile();

    shoesService = testModule.get<ShoesService>(ShoesService);
    usersService = testModule.get<UsersService>(UsersService);

    app = testModule.createNestApplication();
    app.use(
      session({
        secret: 'keyword',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

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

  it('should get all cart items', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
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
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        },
      ]),
    );
  });

  it('should add cart items', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .post('/shopping-cart/add')
      .send({ username: mockedUser.username, productId: 3 })
      .set('Cookie', login.headers['set-cookie']);

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.productId === 3)).toEqual(
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
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      }),
    );
  });

  it('should get updated count of cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .patch('/shopping-cart/count/1')
      .send({ count: 2 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ count: 2 });
  });

  it('should get updated total price of cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const shoe = await shoesService.findOne(1);

    const response = await request(app.getHttpServer())
      .patch('/shopping-cart/total-price/1')
      .send({ total_price: shoe.price * 3 })
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toEqual({ total_price: shoe.price * 3 });
  });

  it('should delete cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    await request(app.getHttpServer())
      .delete('/shopping-cart/one/1')
      .set('Cookie', login.headers['set-cookie']);

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body.find((item) => item.productId === 1)).toBeUndefined();
  });

  it('should delete cart item', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const user = await usersService.findOne({
      where: { username: mockedUser.username },
    });

    await request(app.getHttpServer())
      .delete(`/shopping-cart/all/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    const response = await request(app.getHttpServer())
      .get(`/shopping-cart/${user.id}`)
      .set('Cookie', login.headers['set-cookie']);

    expect(response.body).toStrictEqual([]);
  });
});
