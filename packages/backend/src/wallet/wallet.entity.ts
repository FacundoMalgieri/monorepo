import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ default: false })
  favorite: boolean;

  @Column({ default: false })
  old: boolean;

  @Column({ type: 'float8', default: 0 })
  balance: number;
}
