import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  rating: number;

  @Column()
  pricePerNight: string;

  @Column()
  destination: string;

   @Column({ default: false })
  lateCheckInAvailable: boolean;

  @Column({nullable:true})
  lateCheckInTime:string
}
