import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  TableInheritance
} from 'typeorm';

import { UserStatusEnum } from 'src/auth/user-status.enum';
import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
import { TechnicianTeamEntity } from 'src/technician-teams/entities/technician-team.entity';

export enum UserTypeEnum {
  AdminEntity = "AdminEntity",
  CustomerEntity = "CustomerEntity",
  TechnicianEntity = "TechnicianEntity"
}
/**
 * User Entity
*/
@Entity({
  name: 'user'
})
@TableInheritance({ column: { type: "enum", enum: UserTypeEnum, name: "entity" } })
export class UserEntity extends CustomBaseEntity {
  @Index({
    unique: true
  })
  @Column()
  username: string;

  @Index({
    unique: true
  })
  @Column()
  email: string;

  @Column({
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  password: string;

  @Index()
  @Column()
  name: string;

  // @Column()
  // phoneNumber: string;

  // @Column({
  //   type: 'enum',
  //   enum: UserTypeEnum,
  //   default: UserTypeEnum.CustomerEntity,
  // })
  // entity: UserTypeEnum;

  @Column({
    nullable: true
  })
  address?: string;

  @Column({
    nullable: true
  })
  contact?: string;

  @Column({
    nullable: true
  })
  avatar?: string;

  @Column()
  status: UserStatusEnum;

  @Column({
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  token?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  tokenValidityDate: Date;

  @Column({
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  salt?: string;

  @Column({
    nullable: true
  })
  @Exclude({
    toPlainOnly: true
  })
  twoFASecret?: string;

  @Exclude({
    toPlainOnly: true
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  twoFAThrottleTime?: Date;

  @Column({
    default: false
  })
  isTwoFAEnabled: boolean;

  @Exclude({
    toPlainOnly: true
  })
  skipHashPassword = false;

  @ManyToOne(() => RoleEntity)
  @JoinColumn()
  role: RoleEntity;

  @Column()
  roleId: number;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && !this.skipHashPassword) {
      await this.hashPassword();
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && !this.skipHashPassword) {
      await this.hashPassword();
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}

@ChildEntity()
export class AdminEntity extends UserEntity {
  // Other admin-specific fields...
}

@ChildEntity()
export class CustomerEntity extends UserEntity {
  @OneToMany(() => OrderEntity, order => order.customer)
  orders: OrderEntity[];

  // Other customer-specific fields...
}

@ChildEntity()
export class TechnicianEntity extends UserEntity {
  @ManyToOne(() => TechnicianTeamEntity, team => team.technicians)
  team: TechnicianTeamEntity;

  @Column()
  teamId: number;

  // Other technician-specific fields...
}