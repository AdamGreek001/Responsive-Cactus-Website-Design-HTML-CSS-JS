import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['ADMIN', 'STAFF', 'CLIENT']).optional(),
});

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string(),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;
