import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { registrationSchema, type RegistrationValues } from '../model/registrationSchema';
import styles from './RegistrationForm.module.css';

export function RegistrationForm() {
  const [registeredUser, setRegisteredUser] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      socialLinks: [{ url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const onSubmit = (data: RegistrationValues) => {
    setRegisteredUser(data.username);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="username">Имя пользователя</label>
        <input
          id="username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          {...register('username')}
        />
        {errors.username && <p className={styles.error}>{errors.username.message}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>

      <div className={styles.passwords}>
        <div className={styles.field}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Подтверждение пароля</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <fieldset className={styles.socials}>
        <div className={styles.socialsHeader}>
          <div>
            <legend>Социальные ссылки</legend>
            <p>GitHub, GitVerse или другой профиль</p>
          </div>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => append({ url: '' })}
          >
            Добавить ссылку
          </button>
        </div>

        <div className={styles.links}>
          {fields.map((field, index) => (
            <div className={styles.linkRow} key={field.id}>
              <div className={styles.field}>
                <label htmlFor={`social-${field.id}`}>Ссылка {index + 1}</label>
                <input
                  id={`social-${field.id}`}
                  type="url"
                  placeholder="https://github.com/username"
                  aria-invalid={Boolean(errors.socialLinks?.[index]?.url)}
                  {...register(`socialLinks.${index}.url`)}
                />
                {errors.socialLinks?.[index]?.url && (
                  <p className={styles.error}>
                    {errors.socialLinks[index]?.url?.message}
                  </p>
                )}
              </div>
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => remove(index)}
                aria-label={`Удалить ссылку ${index + 1}`}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
        Зарегистрироваться
      </button>

      {registeredUser && (
        <p className={styles.success} role="status">
          Пользователь {registeredUser} успешно зарегистрирован.
        </p>
      )}
    </form>
  );
}
