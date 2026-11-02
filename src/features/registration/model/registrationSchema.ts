import { z } from 'zod';

export const registrationSchema = z
  .object({
    username: z.string().trim().min(1, 'Введите имя пользователя'),
    email: z.string().trim().min(1, 'Введите email').email('Введите корректный email'),
    password: z
      .string()
      .min(1, 'Введите пароль')
      .min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    socialLinks: z.array(
      z.object({
        url: z.string().trim().min(1, 'Введите ссылку').url('Некорректный URL'),
      }),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;
