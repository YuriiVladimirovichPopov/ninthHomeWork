import { PaginatedType } from "../routers/helpers/pagination";
import { UserViewModel } from "../models/users/userViewModel";
import { usersRepository } from "../repositories/users-repository";
import { PaginatedUser } from "../models/users/paginatedQueryUser";

export const QueryUserRepository = {
  async findAllUsers(
    pagination: PaginatedType,
  ): Promise<PaginatedUser<UserViewModel[]>> {
    return await usersRepository.findAllUsers(pagination);
  },

  async findUserById(id: string): Promise<UserViewModel | null> {
    return usersRepository.findUserById(id);
  },

  async deleteUserById(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id);
  },
};
