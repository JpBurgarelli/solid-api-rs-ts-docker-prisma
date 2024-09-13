import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserEmailAlreadyExistsError } from "./errors/user-email-already-exists-error";

describe("Register use caso", () => {
  it("Allows to register user", async () => {
    const usersRepository = new inMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "joao",
      email: "Joao.burgarelli@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("Creates hash user password upon registration", async () => {
    const usersRepository = new inMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new inMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "Joao.burgarelli@gmail.com";

    const { user } = await registerUseCase.execute({
      name: "joao",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "joao",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserEmailAlreadyExistsError);
  });
});
