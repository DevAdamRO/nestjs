import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Status {
  DONE = 'done',
  PROGRESS = 'progress',
  TODO = 'to_do',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.TODO,
  })
  status: Status;
}
