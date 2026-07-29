import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { TBurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<TBurgerConstructorElementProps> =
  memo(({ ingredient, index = 0, totalItems = 0 }) => {
    const handleMoveDown = () => {};
    const handleMoveUp = () => {};
    const handleClose = () => {};

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
