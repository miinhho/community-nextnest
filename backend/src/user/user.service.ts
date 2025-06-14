import { UserRepository } from '@/user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    return this.userRepository.createUser({ email, password, name });
  }

  async updateUserById(id: string, dataToUpdate: { name?: string; image?: string }) {
    return this.userRepository.updateUserById(id, dataToUpdate);
  }

  async findUserById(id: string) {
    return this.userRepository.findUserById(id);
  }

  async findUserByEmail(email: string, password: boolean = false) {
    return this.userRepository.findUserByEmail(email, password);
  }

  async findUsersByName(name: string, page: number = 1, size: number = 10) {
    return this.userRepository.findUsersByName(name, page, size);
  }

  async deleteUserById(id: string) {
    return this.userRepository.deleteUserById(id);
  }

  async deleteUserByEmail(email: string) {
    return this.userRepository.deleteUserByEmail(email);
  }

  async validateUserExists(id: string) {
    return this.userRepository.validateUserExists(id);
  }
}
