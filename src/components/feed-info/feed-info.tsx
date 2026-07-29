import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import { TOrder } from '@utils-types';

function getOrders(orders: TOrder[], status: string): TOrder[] {
  return orders.filter((order) => order.status === status);
}

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector((state) => state.feed);

  const readyOrders = getOrders(orders, 'done').map((order) => order.number);
  const pendingOrders = getOrders(orders, 'pending').map(
    (order) => order.number
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
