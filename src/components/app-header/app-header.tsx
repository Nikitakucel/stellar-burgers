import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  // Берем имя пользователя из Redux (чтобы в шапке отображалось "Личный кабинет" или имя)
  const { user } = useSelector((state) => state.user);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
