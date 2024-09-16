import bcryptjs from "bcryptjs";
import { usersRepository } from "../repositories/users-repository";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";
import { User } from "@prisma/client";

interface IRegisterUseCase {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  private usersRepository: usersRepository;

  constructor(userRepository: usersRepository) {
    this.usersRepository = userRepository;
  }

  async execute({
    name,
    email,
    password,
  }: IRegisterUseCase): Promise<RegisterUseCaseResponse> {
    const password_hash = await bcryptjs.hash(password, 6);

    const isEmailBeingUsed = await this.usersRepository.findByEmail(email);

    if (isEmailBeingUsed) {
      throw new UserEmailAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
