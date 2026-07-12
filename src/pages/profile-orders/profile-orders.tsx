// src/pages/profile-orders/profile-orders.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.profileOrders);
  const accessToken = getCookie('accessToken')?.replace('Bearer ', '');

  useEffect(() => {
    if (accessToken) {
      dispatch({
        type: 'profileOrders/connect',
        payload: `wss://norma.nomoreparties.space/orders?token=${accessToken}`
      });
    }
    return () => {
      dispatch({ type: 'profileOrders/disconnect' });
    };
  }, [dispatch, accessToken]);

  return <ProfileOrdersUI orders={orders} />;
};
