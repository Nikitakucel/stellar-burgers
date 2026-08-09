import { FC, useEffect } from 'react';
import { useParams, useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const orderFromStore = useSelector((state) => state.order.order);

  const orderData = [...feedOrders, ...profileOrders].find(
    (item) => item.number === Number(number)
  );

  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [orderData, number, dispatch]);

  const finalOrder = orderData || orderFromStore;

  if (!finalOrder || !ingredients.length) {
    return <Preloader />;
  }

  const date = new Date(finalOrder.createdAt);
  const ingredientsInfo = finalOrder.ingredients.reduce(
    (acc: Record<string, TIngredient & { count: number }>, item: string) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        if (!acc[item]) acc[item] = { ...ingredient, count: 1 };
        else acc[item].count++;
      }
      return acc;
    },
    {}
  );

  const total = Object.values(ingredientsInfo).reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  return (
    <OrderInfoUI orderInfo={{ ...finalOrder, ingredientsInfo, date, total }} />
  );
};
