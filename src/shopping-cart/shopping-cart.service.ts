import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { ShoesService } from '../shoes/shoes.service';
import { UsersService } from 'src/users/users.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart)
    private shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UsersService,
    private readonly shoesService: ShoesService,
  ) {}

  async findAll(userId: number | string): Promise<ShoppingCart[]> {
    return this.shoppingCartModel.findAll({ where: { userId } });
  }

  async add(addToCartDto: AddToCartDto) {
    const cart = new ShoppingCart();
    const user = await this.usersService.findOne({
      where: { username: addToCartDto.username },
    });
    const product = await this.shoesService.findOne(addToCartDto.productId);

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
  }

  async updateCount(
    count: number,
    productId: number | string,
  ): Promise<{ count: number }> {
    await this.shoppingCartModel.update({ count }, { where: { productId } });

    const product = await this.shoppingCartModel.findOne({
      where: { productId },
    });
    return { count: product.count };
  }

  async updateTotalPrice(
    total_price: number,
    productId: number | string,
  ): Promise<{ total_price: number }> {
    await this.shoppingCartModel.update(
      { total_price },
      { where: { productId } },
    );

    const product = await this.shoppingCartModel.findOne({
      where: { productId },
    });
    return { total_price: product.total_price };
  }

  async remove(productId: number | string): Promise<void> {
    const product = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    await product.destroy();
  }

  async removeAll(userId: number | string): Promise<void> {
    await this.shoppingCartModel.destroy({ where: { userId } });
  }
}
