import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  FindOneResponse,
  GetBestsellersResponse,
  GetByNameRequest,
  GetByNameResponse,
  GetNewResponse,
  PaginateAndFilterReasponse,
  SearchRequest,
  SearchResponse,
} from './types';

@Controller('shoes')
export class ShoesController {
  constructor(private readonly shoesService: ShoesService) {}

  @ApiOkResponse({ type: PaginateAndFilterReasponse })
  @UseGuards(AuthenticatedGuard)
  @Get()
  paginateAndFilter(@Query() query) {
    return this.shoesService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: FindOneResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('find/:id')
  getOne(@Param('id') id: string) {
    return this.shoesService.findOne(+id);
  }

  @ApiOkResponse({ type: GetBestsellersResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('bestsellers')
  getBestseller() {
    return this.shoesService.bestsellers();
  }

  @ApiOkResponse({ type: GetNewResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('new')
  getNew() {
    return this.shoesService.new();
  }

  @ApiOkResponse({ type: SearchResponse })
  @ApiBody({ type: SearchRequest })
  @UseGuards(AuthenticatedGuard)
  @Post('search')
  search(@Body() { search }: { search: string }) {
    return this.shoesService.searchByString(search);
  }

  @ApiOkResponse({ type: GetByNameResponse })
  @ApiBody({ type: GetByNameRequest })
  @UseGuards(AuthenticatedGuard)
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.shoesService.findOneByName(name);
  }
}
