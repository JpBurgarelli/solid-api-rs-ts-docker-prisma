import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserEmailAlreadyExistsError } from "@/use-cases--sevices/errors/user-email-already-exists-error";
import { RegisterUseCase } from "@/use-cases--sevices/register";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerSchema.parse(request.body);

  try {
    const prismaUserRepository = new PrismaUsersRepository();

    const registerUseCase = new RegisterUseCase(prismaUserRepository);

    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserEmailAlreadyExistsError) {
      return reply.status(409).send();
    }

    throw err;
  }

  return reply.status(201).send();
}
