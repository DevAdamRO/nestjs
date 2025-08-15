import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // 👈 tu entidad
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule], // 👈 Esto registra el repositorio
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UsersService], // 👈 EXPORTA UsersService
})
export class UsersModule {}
