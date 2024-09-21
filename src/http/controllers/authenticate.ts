import { InvalidCredentialError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
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
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialError) {
      return reply.status(400).send();
    }

    throw err;
  }

  return reply.status(200).send();
}
