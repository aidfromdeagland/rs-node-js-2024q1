import crypto from 'node:crypto';
import { NoUserError } from '../shared/errors.ts';

export type UserModel = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

const users: Map<string, UserModel> = new Map();

export const UsersRepository = {
  async getAll() {
    return Array.from(users).map((entry) => entry[1]);
  },

  async getById(id: string) {
    const user = users.get(id);
    if (!user) {
      throw new NoUserError();
    }

    return user;
  },

  async create(data: Omit<UserModel, 'id'>) {
    const id = crypto.randomUUID();
    const user = { id, ...data };
    users.set(id, user);
    return user;
  },

  async update(id: string, data: Omit<UserModel, 'id'>) {
    const user = users.get(id);
    if (!user) {
      throw new NoUserError();
    }

    Object.assign(user, data);
    return user;
  },

  async delete(id: string) {
    if (!users.delete(id)) {
      throw new NoUserError();
    }
  },
};
