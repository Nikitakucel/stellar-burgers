import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '@ui';
import { Preloader } from '@ui';

export const IngredientPage = () => {
  const { id } = useParams();
  const { items } = useSelector((state) => state.ingredients);
  
  const ingredient = items.find((item) => item._id === id);

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
