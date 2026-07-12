import { RefObject } from 'react';
import { TIngredient, TTabMode } from '@utils-types';

export type BurgerIngredientsUIProps = {
  currentTab: TTabMode;
  buns: (TIngredient & { count: number })[];
  mains: (TIngredient & { count: number })[];
  sauces: (TIngredient & { count: number })[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  titleSaucesRef: RefObject<HTMLHeadingElement>;
  bunsRef: (node?: Element | null | undefined) => void;
  mainsRef: (node?: Element | null | undefined) => void;
  saucesRef: (node?: Element | null | undefined) => void;
  onTabClick: (val: string) => void;
  onIngredientClick: (id: string) => void; // <-- Добавили эту строчку
};
