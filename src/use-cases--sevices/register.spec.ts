import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";

let usersRepository: inMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("Allows to register user", async () => {
    const { user } = await sut.execute({
      name: "joao",
      email: "Joao.burgarelli@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Creates hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "joao",
      email: "Joao.burgarelli@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "Joao.burgarelli@gmail.com";

    await sut.execute({
      name: "joao",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "joao",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);
  });
});
