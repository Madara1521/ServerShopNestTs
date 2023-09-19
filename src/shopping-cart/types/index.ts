import { ApiProperty } from '@nestjs/swagger';

class ShoppingCartItem {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 29 })
  productId: number;

  @ApiProperty({ example: 5245 })
  price: number;

  @ApiProperty({ example: 6 })
  in_stock: number;

  @ApiProperty({ example: 3 })
  count: number;

  @ApiProperty({ example: 5245 })
  total_price: number;

  @ApiProperty({ example: 20 })
  id: number;

  @ApiProperty({ example: 'Salomon' })
  shoes_manufacturer: string;

  @ApiProperty({ example: 'France' })
  country_maufacturer: string;

  @ApiProperty({
    example:
      'https://loremflickr.com/640/480/fashion?random=598060219134107092786145630249',
  })
  image: string;

  @ApiProperty({ example: 'Amet amet.' })
  name: string;

  @ApiProperty({ example: '2023-09-19T08:34:39.519Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-09-19T08:34:39.519Z' })
  createdAt: string;
}

export class GetAllResponse extends ShoppingCartItem {}
export class AddToCardResponse extends ShoppingCartItem {}
export class UpdateCountResponse {
  @ApiProperty({ example: 3 })
  count: number;
}
export class UpdateCountRequest {
  @ApiProperty({ example: 3 })
  count: number;
}

export class TotalPriceResponse {
  @ApiProperty({ example: 5245 })
  total_price: number;
}
export class TotalPriceRequest {
  @ApiProperty({ example: 5245 })
  total_price: number;
}
