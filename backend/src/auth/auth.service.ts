import { UserLoginDto } from '@/auth/dto/user-login.dto';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync, genSalt, hash } from 'bcrypt';

const SALT_ROUND = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email, true);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = this.comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(user: User) {
    const validatedUser = await this.validateUser(user.email, user.password);

    const payload = {
      sub: validatedUser.id,
      email: validatedUser.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(userDto: UserLoginDto) {
    const isExist = await this.userService.findUserByEmail(userDto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(userDto.password);
    const user = await this.userService.createUser({
      email: userDto.email,
      password: hashedPassword,
    });

    if (!user) {
      throw new InternalServerErrorException('Cannot create user');
    }

    return this.login(user);
  }

  async hashPassword(plain: string) {
    const salt = await genSalt(SALT_ROUND);
    return hash(plain, salt);
  }

  comparePassword(plain: string, hashed: string) {
    return compareSync(plain, hashed);
  }
}
