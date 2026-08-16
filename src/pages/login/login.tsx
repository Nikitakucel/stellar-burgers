import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(''); // сбрасываем предыдущую ошибку

    // Получаем адрес, откуда пришел пользователь (если есть)
    const from = location.state?.from || '/';

    dispatch(loginUser({ email, password }))
      .unwrap() // важно: без unwrap() .then() сработает даже при ошибке
      .then(() => {
        // Успешный вход — переходим на исходную страницу
        navigate(from, { replace: true });
      })
      .catch((err) => {
        // Ошибка — показываем сообщение и остаемся на странице входа
        setError(err.message || 'Неверный логин или пароль');
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
