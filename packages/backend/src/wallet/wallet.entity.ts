import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 42 })
  address: string;

  @Column({ default: false })
  favorite: boolean;

  @Column({ type: 'float8', default: 0 })
  eth: number;
}
