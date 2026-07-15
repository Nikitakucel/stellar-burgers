// src/components/ui/profile-ui/profile-ui.tsx
import { FC, SyntheticEvent } from 'react';
import { ProfileUIProps } from './type';
import {
  Button,
  Input
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './profile-ui.module.css';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  handleCancel,
  handleSubmit,
  handleInputChange,
  handleLogout
}) => (
  <form className={styles.form} onSubmit={handleSubmit}>
    <div className={styles.input}>
      <Input
        type={'text'}
        placeholder={'Имя'}
        onChange={handleInputChange}
        value={formValue.name}
        name={'name'}
        error={false}
        errorText={'Ошибка'}
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
        errorText={'Ошибка'}
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
        errorText={'Ошибка'}
        size={'default'}
        icon={'EditIcon'}
      />
    </div>
    {isFormChanged && (
      <div className={styles.button}>
        <Button
          type='secondary'
          size='medium'
          onClick={handleCancel}
          htmlType='button' // <-- ДОБАВЛЕНО
        >
          Отмена
        </Button>
        <Button
          type='primary'
          size='medium'
          htmlType='submit' // <-- ДОБАВЛЕНО
        >
          Сохранить
        </Button>
      </div>
    )}
    <button
      type='button'
      className={styles.logoutButton}
      onClick={handleLogout}
    >
      Выход
    </button>
  </form>
);
