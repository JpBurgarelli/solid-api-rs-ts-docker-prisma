import { UserEmailAlreadyExistsError } from "@/use-cases/errors/user-email-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
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
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserEmailAlreadyExistsError) {
      return reply.status(409).send();
    }

    throw err;
  }

  return reply.status(201).send();
}
