import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum UserRole {
  OWNER = 'owner',
  ADMIN_1 = 'admin_1',
  ADMIN_2 = 'admin_2',
  ADMIN_3 = 'admin_3',
  USER = 'user',
}
export enum AuthMethod {
  OTP = 'otp',
  PASSWORD = 'password',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 11 })
  mobile!: string;

  @Column({ nullable: true, unique: true, type: 'varchar', length: 255 })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string;

  @Column({ nullable: true, type: 'varchar' })
  name!: string;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string;

  @Column({ type: 'enum', enum: AuthMethod, default: AuthMethod.OTP })
  authMethod!: AuthMethod;

  @Column({ default: false })
  isProfileComplete!: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  walletBalance!: number;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  referralCode!: string;

  @Column({ nullable: true, type: 'varchar' })
  referrerId!: string;

  @ManyToOne(() => User, (user) => user.referredUsers, { nullable: true })
  @JoinColumn({ name: 'referrerId' })
  referrer!: User;

  @OneToMany(() => User, (user) => user.referrer)
  referredUsers!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
