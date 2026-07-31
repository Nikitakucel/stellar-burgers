import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.profileOrders);

  useEffect(() => {
    // Вместо wsConnect вызываем обычный get-запрос с авторизацией
    // Токен подставится автоматически внутри fetchProfileOrders, который вызывает getOrdersApi
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
