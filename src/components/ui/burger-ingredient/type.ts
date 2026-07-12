import { Location } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  locationState: { background: Location };
  // Это для кнопки "+ Добавить"
  handleAdd: () => void;
  // Это для клика по самой карточке (чтобы открыть модалку)
  onClick: () => void;
};
