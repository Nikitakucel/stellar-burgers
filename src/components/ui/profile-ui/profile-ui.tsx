import { FC, SyntheticEvent } from 'react';
import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom'; // <--- ИМПОРТ ДЛЯ ССЫЛОК
import { ProfileUIProps } from './type';
import styles from './profile-ui.module.css';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  handleSubmit,
  handleCancel,
  handleInputChange,
  handleLogout
}) => (
  <div className={styles.container}>
    {/* Меню в виде списка */}
    <ul className={styles.menuList}>
      <li className={styles.menuItem}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
        >
          Профиль
        </NavLink>
      </li>
      <li className={styles.menuItem}>
        <NavLink
          to='/profile/orders'
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
        >
          История заказов
        </NavLink>
      </li>
      <li className={styles.menuItem}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Выход
        </button>
      </li>
      {/* ВОЗВРАЩАЕМ ТЕКСТ, КОТОРЫЙ ПРОПАЛ */}
      <div className={styles.text}>
        В этом разделе вы можете изменить свои персональные данные
      </div>
    </ul>

    {/* Форма профиля */}
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.input}>
        <Input
          type={'text'}
          placeholder={'Имя'}
          onChange={handleInputChange}
          value={formValue.name}
          name={'name'}
          error={false}
          errorText={''}
          size={'default'}
          icon={'EditIcon'}
        />
      </div>
      <div className={styles.input}>
        <Input
          type={'email'}
          placeholder={'E-mail'}
          onChange={handleInputChange}
          value={formValue.email}
          name={'email'}
          error={false}
          errorText={''}
          size={'default'}
          icon={'EditIcon'}
        />
      </div>
      <div className={styles.input}>
        <Input
          type={'password'}
          placeholder={'Пароль'}
          onChange={handleInputChange}
          value={formValue.password}
          name={'password'}
          error={false}
          errorText={''}
          size={'default'}
          icon={'EditIcon'}
        />
      </div>
      {isFormChanged && (
        <div className={styles.button}>
          <Button
            type='secondary'
            htmlType='button'
            size='medium'
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button type='primary' size='medium' htmlType='submit'>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  </div>
);
