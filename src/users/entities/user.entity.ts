import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { UserRole } from '../dto/create-user.dto';
import { Post } from 'src/posts/entities/post.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true }) // ✅ FIX AQUI
  birthDate: string | null;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true, // opcional
  })
  profile: Profile;
}
