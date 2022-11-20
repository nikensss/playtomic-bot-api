import { z } from 'zod';

const telegramJwtValidator = z.object({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  language_code: z.string(),
});

export type TelegramJwt = z.infer<typeof telegramJwtValidator>;

export const isTelegramJwt = (payload: unknown): payload is TelegramJwt => {
  return telegramJwtValidator.safeParse(payload).success;
};
