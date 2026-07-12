// src/pages/profile/profile.tsx
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser, logoutUser } from '../../services/slices/userSlice';
import { ProfileUI } from '../../components/ui/profile-ui/profile-ui';

export const Profile = () => {
  const dispatch = useDispatch();

  // 1. Берем реальные данные пользователя из Redux
  const { user } = useSelector((state) => state.user);

  // 2. Инициализируем форму данными пользователя
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // 3. Если данные пользователя в Redux изменились (подгрузились), обновляем форму
  useEffect(() => {
    if (user) {
      setFormValue((prev) => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  // 4. Проверяем, изменились ли данные в форме по сравнению с Redux
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // 5. Обработчик отправки формы (Сохранить)
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    // Собираем только измененные поля
    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (user?.name !== formValue.name) updatedData.name = formValue.name;
    if (user?.email !== formValue.email) updatedData.email = formValue.email;
    if (formValue.password !== '') updatedData.password = formValue.password;

    dispatch(updateUser(updatedData));
  };

  // 6. Обработчик отмены (возвращает исходные значения)
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  // 7. Обработчик выхода из системы
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // 8. Обработчик изменения полей ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout} // <-- Передаем выход в UI
    />
  );
};
