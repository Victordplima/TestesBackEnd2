// services/UserServices.ts
import { UserRepository } from "../database/UserRepository";
import { User } from "../model/User";
import { CustomError } from "../errors/CustomError";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    return user;
  }

  async getAllUsers(currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'ADMIN') {
      throw new CustomError(403, "Unauthorized: Only admins can access this resource");
    }
    const users = await this.userRepository.getAllUsers();
    return users;
  }
}
