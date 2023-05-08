import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float8' })
  eur: number;

  @Column({ type: 'float8' })
  usd: number;

  @Column({ type: 'varchar', length: 42 })
  @Index({ unique: true })
  address: string;
}
