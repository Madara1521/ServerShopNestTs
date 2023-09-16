import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

class Shoes {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Adidas' })
  shoes_manufacturer: string;

  @ApiProperty({ example: 1521 })
  price: number;

  @ApiProperty({ example: 'Ukraine' })
  country_maufacturer: string;

  @ApiProperty({ example: faker.internet.password() })
  vendor_code: string;

  @ApiProperty({ example: faker.lorem.word() })
  name: string;

  @ApiProperty({ example: faker.lorem.sentence() })
  description: string;

  @ApiProperty({ example: faker.image.fashion() })
  images: string;

  @ApiProperty({ example: 6 })
  in_stock: number;

  @ApiProperty({ example: true })
  bestseller: boolean;

  @ApiProperty({ example: false })
  new: boolean;

  @ApiProperty({ example: 152 })
  popularity: number;

  @ApiProperty({ example: faker.image.city() })
  compatibility: string;

  @ApiProperty({ example: '2023-09-14T23:33:24.612Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-09-14T23:33:24.612Z' })
  createdAt: string;
}

export class PaginateAndFilterReasponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: Shoes, isArray: true })
  rows: Shoes;
}

export class Bestsellers extends Shoes {
  @ApiProperty({ example: true })
  bestseller: boolean;
}

export class GetBestsellersResponse extends PaginateAndFilterReasponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: Shoes, isArray: true })
  rows: Bestsellers;
}

class NewShoes extends Shoes {
  @ApiProperty({ example: true })
  new: boolean;
}

export class GetNewResponse extends PaginateAndFilterReasponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: Shoes, isArray: true })
  rows: NewShoes;
}

export class SearchByLetterResponse extends Shoes {
  @ApiProperty({ example: 'Inventore veniam.' })
  name: string;
}
export class SearchResponse extends PaginateAndFilterReasponse {
  @ApiProperty({ type: SearchByLetterResponse, isArray: true })
  rows: SearchByLetterResponse;
}
export class SearchRequest {
  @ApiProperty({ example: 'nia' })
  search: string;
}

export class GetByNameResponse extends Shoes {
  @ApiProperty({ example: 'Inventore veniam.' })
  name: string;
}

export class GetByNameRequest {
  @ApiProperty({ example: 'Inventore veniam.' })
  name: string;
}

export class FindOneResponse extends Shoes {}

export interface IShoesQuery {
  limit: string;
  offset: string;
}
