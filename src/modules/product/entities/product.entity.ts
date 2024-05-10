import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { AuditoryEntity } from '../../auditory/entities/auditory.entity';

@Entity({ name: 'tbl_product' })
export class Product extends AuditoryEntity {
  @PrimaryGeneratedColumn({ name: 'int_id' })
  id: number;

  @Column({ name: 'vch_handle', length: 100 })
  handle: string;

  @Column({ name: 'vch_title', length: 100 })
  title: string;

  @Column({ name: 'vch_description', length: 3000 })
  description: string;

  @Column({ name: 'int_stock' })
  stock: number;

  @Column({
    name: 'dec_weight_in_grams',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  weightInGrams: number;

  @Column({ name: 'vch_sku', length: 20 })
  sku: string;

  @Column({ name: 'vch_barcode', length: 20 })
  barcode: string;

  @Column({ name: 'dec_price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'dec_compare_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  comparePrice: number;

  @DeleteDateColumn({ name: 'dat_deleted_at', nullable: true })
  deletedAt: Date | null;
}
