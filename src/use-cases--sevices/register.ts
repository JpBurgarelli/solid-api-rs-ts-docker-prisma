import { hash } from "bcryptjs";
import { usersRepository } from "../repositories/users-repository";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";

interface IRegisterUseCase {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  private usersRepository: usersRepository;

  constructor(userRepository: usersRepository) {
    this.usersRepository = userRepository;
  }

  async execute({ name, email, password }: IRegisterUseCase) {
    const password_hash = await hash(password, 6);

    const isEmailBeingUsed = await this.usersRepository.findByEmail(email);

    if (isEmailBeingUsed) {
      throw new UserEmailAlreadyExistsError();
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
