import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/burgerConstructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { TBurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<TBurgerConstructorElementProps> =
  memo(({ ingredient, index = 0, totalItems = 0 }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ id: ingredient.id, direction: 'down' }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ id: ingredient.id, direction: 'up' }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  });
