import { Link } from 'react-router-dom';
import { RegistrationForm } from 'features/registration';
import { SubscriptionWizard } from 'features/subscription';
import styles from './RegistrationPage.module.css';

export function RegistrationPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Создание аккаунта</p>
          <h1>Регистрация</h1>
          <p className={styles.description}>
            Заполните данные профиля и добавьте ссылки, по которым вас можно найти.
          </p>
        </div>
        <Link to="/tasks">Открыть задачи</Link>
      </header>

      <div className={styles.layout}>
        <section aria-labelledby="registration-title">
          <h2 className={styles.sectionTitle} id="registration-title">
            Данные пользователя
          </h2>
          <RegistrationForm />
        </section>

        <aside className={styles.aside} aria-labelledby="subscription-title">
          <div>
            <p className={styles.asideLabel}>Бонусное задание</p>
            <h2 id="subscription-title">Подписка на новости</h2>
            <p>Небольшая форма в два шага на React 19.</p>
          </div>
          <SubscriptionWizard />
        </aside>
      </div>
    </main>
  );
}
