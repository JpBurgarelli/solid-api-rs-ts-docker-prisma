import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "@/use-cases--sevices/authenticate";
import { InvalidCredentialError } from "@/use-cases--sevices/errors/invalid-credentials-error";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateSchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateSchema.parse(request.body);

  try {
    const prismaUserRepository = new PrismaUsersRepository();

    const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository);

    await authenticateUseCase.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send();
    }

    throw err;
  }

  return reply.status(200).send();
}
