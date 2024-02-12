import crypto from 'node:crypto';

export type UserModel = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

const users: Map<string, UserModel> = new Map();

export const UsersRepository = {
  async getAll() {
    return users.values();
  },

  async getById(id: string) {
    const user = users.get(id);
    if (!user) {
      throw new Error('there is no user with provided id');
    }

    return user;
  },

  async create(data: Omit<UserModel, 'id'>) {
    const id = crypto.randomUUID();
    const user = { ...data, id };
    users.set(id, user);
    return user;
  },

  async update(id: string, data: Omit<UserModel, 'id'>) {
    const user = users.get(id);
    if (!user) {
      throw new Error('there is no user with provided id');
    }

    Object.assign(user, data);
    return user;
  },

  async delete(id: string) {
    if (!users.delete(id)) {
      throw new Error('there is no user with provided id');
    }
  },
};
