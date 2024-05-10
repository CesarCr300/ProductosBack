import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  handle: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNumber()
  stock: number;
  @IsNumber()
  weightInGrams: number;
  @IsNotEmpty()
  sku: string;
  @IsNotEmpty()
  barcode: string;
  @IsNumber()
  price: number;
  @IsNumber()
  comparePrice: number;
}
