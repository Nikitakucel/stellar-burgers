import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { BurgerIngredients } from '../../components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '../../components/burger-constructor/burger-constructor';
import styles from './constructor-page.module.css';

export const ConstructorPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        {loading && (
          <p className='text text_type_main-medium'>Загрузка ингредиентов...</p>
        )}
        {error && (
          <p className='text text_type_main-medium text_color_error'>
            Ошибка: {error}
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <>
            <BurgerIngredients />
            <BurgerConstructor />
          </>
        )}
      </div>
    </main>
  );
};
