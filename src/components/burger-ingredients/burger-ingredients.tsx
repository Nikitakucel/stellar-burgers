import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.ingredients);
  const { bun: chosenBun, ingredients: chosenIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  // вычисляем счётчики
  const counters = useMemo(() => {
    const counts: Record<string, number> = {};
    chosenIngredients.forEach((ing) => {
      counts[ing._id] = (counts[ing._id] || 0) + 1;
    });
    if (chosenBun) {
      counts[chosenBun._id] = 2;
    }
    return counts;
  }, [chosenBun, chosenIngredients]);

  const buns = useMemo(
    () =>
      items
        .filter((item) => item.type === 'bun')
        .map((item) => ({ ...item, count: counters[item._id] || 0 })),
    [items, counters]
  );

  const mains = useMemo(
    () =>
      items
        .filter((item) => item.type === 'main')
        .map((item) => ({ ...item, count: counters[item._id] || 0 })),
    [items, counters]
  );

  const sauces = useMemo(
    () =>
      items
        .filter((item) => item.type === 'sauce')
        .map((item) => ({ ...item, count: counters[item._id] || 0 })),
    [items, counters]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
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

  const handleIngredientClick = (id: string) => {
    navigate(`/ingredients/${id}`, { state: { background: location } });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onIngredientClick={handleIngredientClick}
    />
  );
};
