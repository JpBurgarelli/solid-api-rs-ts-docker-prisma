import { expect, describe, it, beforeEach } from "vitest";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialError } from "./errors/invalid-credentials-error";

let usersRepository: inMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case", () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("Authenticates user", async () => {
    await usersRepository.create({
      name: "Joao",
      email: "Joao.burgarelli@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "Joao.burgarelli@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Not Authenticates if email is wrong", async () => {
    expect(() =>
      sut.execute({
        email: "Joao.burgarelli@gmail.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });

  it("Not Authenticates if password is wrong", async () => {
    await usersRepository.create({
      name: "Joao",
      email: "Joao.burgarelli@gmail.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "Joao.burgarelli@gmail.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError);
  });
});
