import { TConstructorIngredient } from '@utils-types';

export type TBurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems?: number;
};
