import { z } from 'zod';

const telegramJwtValidator = z.object({
  id: z.number(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string(),
  language_code: z.string(),
});

export type TelegramJwt = z.infer<typeof telegramJwtValidator>;

export const isTelegramJwt = (payload: unknown): payload is TelegramJwt => {
  return telegramJwtValidator.safeParse(payload).success;
};
