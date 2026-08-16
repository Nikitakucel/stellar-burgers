import { TOrder } from './types';

export const getOrders = (orders: TOrder[], status: string) =>
  orders.filter((order) => order.status === status);
