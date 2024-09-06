import { Prisma, User } from "@prisma/client";

export interface usersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}

/* 
Essa interface 'e nosso contrato, pois nela 'e
difinido quais metodos vao existir na comunicacao entre
o repository e o use-case
 * */
