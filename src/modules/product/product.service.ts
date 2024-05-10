import { Injectable } from '@nestjs/common';
import { ServiceBase } from '../../base/service.base';
import {
  CreateProductDto,
  FilterProductDto,
  ResponseManyProductDto,
  ResponseProductDto,
  UpdateProductDto,
} from './dtos';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';

@Injectable()
export class ProductService extends ServiceBase<
  {
    name: 'Product';
    type: Product;
  },
  Product,
  ResponseManyProductDto,
  ResponseProductDto,
  FilterProductDto,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(_productRepository: ProductRepository) {
    super(_productRepository, {
      article: 'el',
      resourceName: 'producto',
      requiresValidationInUpdate: true,
      requiresValidationInCreation: true,
      adapterFindAll: (e: Product) => e,
      adapterFindOne: (e: Product) => e,
      functionToCreateObjectToFindIfTheEntityAlreadyExists: (
        dto: Product | CreateProductDto,
      ) => ({
        handle: dto.handle,
      }),
    });
  }
}
