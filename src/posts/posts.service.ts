import { Injectable, Req } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryPostsDto } from './dto/query-posts.dto';
import { Category } from 'src/categories/entities/category.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category) // 👈 Aquí lo inyectas
    private readonly categoryRepo: Repository<Category>,
  ) {
    //
  }

  async create(createPostDto: CreatePostDto, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    let categories: Category[] = [];

    // 🔐 Validación defensiva para evitar errores de ESLint y TS
    const raw = createPostDto.categories;
    if (Array.isArray(raw) && raw.every((id) => typeof id === 'number')) {
      categories = await this.categoryRepo.findBy({
        id: In(raw),
      });
    }

    const post = this.postRepo.create({
      ...createPostDto,
      author: user,
      categories,
    });

    return this.postRepo.save(post);
  }

  findAll() {
    return this.postRepo.find({ relations: ['author', 'categories'] });
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException();

    if (!post.published) {
      throw new ForbiddenException('Este post no está publicado');
    }

    return post;
  }

  async remove(id: number): Promise<void> {
    await this.postRepo.delete(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post no encontrado');

    if (post.author.id !== userId) {
      throw new ForbiddenException('No puedes editar un post que no es tuyo');
    }

    const { categories, ...rest } = updatePostDto;

    const dataToUpdate: Partial<Post> & { categories?: Category[] } = {
      ...rest,
    };

    if (Array.isArray(categories) && categories.length > 0) {
      dataToUpdate.categories = categories.map((id) => ({ id }) as Category);
    }

    await this.postRepo.update(id, dataToUpdate);
    return this.findOne(id);
  }

  ///posts?authorId=1&published=true&search=nestjs&page=2&limit=5
  async findAllFiltered(query: QueryPostsDto) {
    const { authorId, published, search, page = '1', limit = '10' } = query;

    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'categories') // 👈 ¡Aquí agregamos las categorías!
      .orderBy('post.id', 'DESC');

    // Filtro por autor
    if (authorId) {
      qb.andWhere('post.authorId = :authorId', { authorId: parseInt(authorId, 10) });
    }

    // Filtro por published
    if (typeof published === 'string') {
      qb.andWhere('post.published = :published', { published: published === 'true' });
    }

    // 🔍 Filtro por búsqueda en título o contenido
    if (search) {
      qb.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Paginación
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    qb.skip(skip).take(parseInt(limit, 10));

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: parseInt(page, 10),
      lastPage: Math.ceil(total / parseInt(limit, 10)),
    };
  }
}
