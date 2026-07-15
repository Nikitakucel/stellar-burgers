// src/components/burger-ingredients/burger-ingredients.tsx
import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useLocation } from 'react-router-dom';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { TIngredient } from '../../utils/types';

export const BurgerIngredients: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Получаем список всех ингредиентов и текущий конструктор из Redux
  const { items } = useSelector((state) => state.ingredients);
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  // 2. Фильтруем ингредиенты по категориям
  const buns = items.filter((item) => item.type === 'bun');
  const mains = items.filter((item) => item.type === 'main');
  const sauces = items.filter((item) => item.type === 'sauce');

  // 3. Функция для подсчета количества каждого ингредиента в конструкторе
  const getIngredientCount = (id: string) => {
    if (bun?._id === id) return 1; // Булка может быть только одна
    return constructorIngredients.filter((item) => item._id === id).length;
  };

  // 4. Обработчик клика для открытия модального окна с деталями (и изменения URL)
  const onIngredientClick = (id: string) => {
    navigate(`/ingredients/${id}`, { state: { background: location } });
  };

  // 5. Логика скролла табов (оставил как в шаблоне)
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 6. Передаём в UI компонент данные с обогащенным свойством count
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns.map((item) => ({
        ...item,
        count: getIngredientCount(item._id)
      }))}
      mains={mains.map((item) => ({
        ...item,
        count: getIngredientCount(item._id)
      }))}
      sauces={sauces.map((item) => ({
        ...item,
        count: getIngredientCount(item._id)
      }))}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      // Передаем колбэк нажатия на ингредиент
      onIngredientClick={onIngredientClick}
    />
  );
};
