import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { order, loading: orderRequest } = useSelector((state) => state.order);
  const { isAuth } = useSelector((state) => state.user);

  const constructorItems = {
    bun,
    ingredients
  };

  const orderModalData = order
    ? ({
        ...order,
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        ingredients: [],
        number: order.number
      } as TOrder)
    : null;

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds)).then(() => {
      dispatch(clearConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
