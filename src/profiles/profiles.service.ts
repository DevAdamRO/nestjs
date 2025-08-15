import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {
    //
  }

  async create(createProfileDto: CreateProfileDto, user: User): Promise<Profile> {
    const profile = this.profileRepo.create({
      ...createProfileDto,
      user,
    });

    return this.profileRepo.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepo.find({
      relations: ['user'], // opcional, si quieres mostrar el usuario asociado
    });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) throw new NotFoundException(`Profile with ID ${id} not found`);

    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, updateProfileDto);
    return this.profileRepo.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await this.profileRepo.remove(profile);
  }
}
