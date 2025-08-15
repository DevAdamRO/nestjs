import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { QueryUsersDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    // Constructor logic if needed
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepo.save(user);
  }

  // findAll() {
  //   return this.userRepo.find();
  // }
  async findAllPaginatedAndFiltered(query: QueryUsersDto) {
    const { page = '1', limit = '10', role, isActive } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const qb = this.userRepo.createQueryBuilder('user');

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (typeof isActive === 'string') {
      qb.andWhere('user.isActive = :isActive', { isActive: isActive === 'true' });
    }

    const [data, total] = await qb.skip(skip).take(parseInt(limit)).getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page),
      lastPage: Math.ceil(total / parseInt(limit)),
    };
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id, updateUserDto);
    return this.findOne(id); // devuelve el usuario actualizado
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async updateRefreshToken(userId: number, hashedToken: string): Promise<void> {
    await this.userRepo.update(userId, {
      refreshToken: hashedToken,
    });
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      refreshToken: null,
    });
  }
}
