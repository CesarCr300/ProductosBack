import { EntityBase } from '../../../base/entity.base';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from './type-user.entity';
import { AuditoryEntity } from '../../auditory/entities/auditory.entity';

@Entity({ name: 'tbl_user' })
export class User extends AuditoryEntity implements EntityBase {
  @PrimaryGeneratedColumn({ name: 'int_id' })
  id: number;
  @Column({ name: 'vch_email' })
  email: string;
  @Column({ name: 'vch_password' })
  password: string;
  @Column({ name: 'vch_name' })
  name: string;
  @Column({ name: 'vch_lastname' })
  lastName: string;
  @Column({ name: 'int_phone_number' })
  phoneNumber: number;

  @Column({ name: 'int_user_type_id' })
  userTypeId: number;
  @DeleteDateColumn({ name: 'dat_deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => UserType, (type) => type.users)
  @JoinColumn({ name: 'int_user_type_id' })
  userType: UserType;
}
