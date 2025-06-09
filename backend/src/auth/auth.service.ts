import { UserRegisterDto } from '@/auth/dto/register.dto';
import { JwtPayload } from '@/auth/jwt/token.types';
import { UserData } from '@/types/user.data';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
      throw new BadRequestException('Invalid credentials');
    }
    const isMatch = this.comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    } as UserData;
  }

  async login(user: UserData) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      } as UserData,
    };
  }

  async register(userDto: UserRegisterDto) {
    const isExist = await this.userService.findUserByEmail(userDto.email);
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await this.hashPassword(userDto.password);
    const user = await this.userService.createUser({
      email: userDto.email,
      password: hashedPassword,
      name: userDto.name,
    });

    if (!user) {
      throw new InternalServerErrorException('Cannot create user');
    }

    return this.login({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  async hashPassword(plain: string) {
    const salt = await genSalt(SALT_ROUND);
    return hash(plain, salt);
  }

  comparePassword(plain: string, hashed: string) {
    return compareSync(plain, hashed);
  }
}
