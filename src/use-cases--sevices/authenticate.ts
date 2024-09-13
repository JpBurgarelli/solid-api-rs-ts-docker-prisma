import { usersRepository } from "@/repositories/users-repository";
import { InvalidCredentialError } from "./errors/invalid-credentials-error";
import { User } from "@prisma/client";
import bcryptjs from "bcryptjs";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: usersRepository) {}
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialError();
    }

    const doesPasswordMatches = await bcryptjs.compare(
      password,
      user.password_hash,
    );

    if (!doesPasswordMatches) {
      throw new InvalidCredentialError();
    }

    return {
      user,
    };
  }
}
