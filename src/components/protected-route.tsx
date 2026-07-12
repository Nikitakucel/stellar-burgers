import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactNode } from 'react';
// Правильный путь к Store (из components/ подняться на уровень вверх)
import { useSelector } from '../services/store';
// Самый правильный путь к Preloader (он лежит в components/ui/preloader)
import { Preloader } from './ui/preloader/preloader';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  // Пока оставляем any, чтобы не было ошибок типов, потом TypeScript сам всё подхватит
  const { isAuth, isAuthChecked } = useSelector((state: any) => state.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
