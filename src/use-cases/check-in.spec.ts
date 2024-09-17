import { inMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: inMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new inMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
  });

  it("Allows to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-02",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
