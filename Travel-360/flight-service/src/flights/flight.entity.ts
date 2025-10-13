import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()              //tells the database table
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  from: string;

  @Column()
  destination: string;

  @Column()
  departTime: string;

  @Column()
  arriveTime: string;

  @Column()
  price: string;
}
