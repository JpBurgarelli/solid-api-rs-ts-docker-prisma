import { inMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { ResourceNotFoundError } from "./errors/resourve-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile";

let usersRepository: inMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("Allows to get user profiles", async () => {
    const createdUser = await usersRepository.create({
      name: "Joao",
      email: "Joao.burgarelli@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Joao");
  });

  it("Not be able to get user profile with wrong id", async () => {
    expect(() =>
      sut.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
