import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  AddToCardResponse,
  GetAllResponse,
  TotalPriceRequest,
  TotalPriceResponse,
  UpdateCountRequest,
  UpdateCountResponse,
} from './types';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({ type: [GetAllResponse] })
  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  getAll(@Param('id') userId: string) {
    return this.shoppingCartService.findAll(userId);
  }

  @ApiOkResponse({ type: AddToCardResponse })
  @UseGuards(AuthenticatedGuard)
  @Post('/add')
  addToCart(@Body() addTocartDto: AddToCartDto) {
    return this.shoppingCartService.add(addTocartDto);
  }

  @ApiOkResponse({ type: UpdateCountResponse })
  @ApiBody({ type: UpdateCountRequest })
  @UseGuards(AuthenticatedGuard)
  @Patch('/count/:id')
  updateCount(
    @Body() { count }: { count: number },
    @Param('id') productId: string,
  ) {
    return this.shoppingCartService.updateCount(count, productId);
  }

  @ApiOkResponse({ type: TotalPriceResponse })
  @ApiBody({ type: TotalPriceRequest })
  @UseGuards(AuthenticatedGuard)
  @Patch('/total-price/:id')
  updateTotalPrice(
    @Body() { total_price }: { total_price: number },
    @Param('id') productId: string,
  ) {
    return this.shoppingCartService.updateTotalPrice(total_price, productId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/one/:id')
  removeOne(@Param('id') productId: string) {
    return this.shoppingCartService.remove(productId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/all/:id')
  removeAll(@Param('id') userId: string) {
    return this.shoppingCartService.removeAll(userId);
  }
}
