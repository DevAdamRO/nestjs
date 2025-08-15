import { User } from 'src/users/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Pick<User, 'id' | 'email' | 'role'>;
  }
}
