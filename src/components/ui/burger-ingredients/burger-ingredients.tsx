import { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components'; // Импортируем Tab из правильной библиотеки

import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '../../ingredients-category';

import styles from './burger-ingredients.module.css';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick,
    onIngredientClick
  }) => (
    <section className={styles.container}>
      <h1 className='text text_type_main-large mt-10 mb-5'>Соберите бургер</h1>

      {/* Меняем ручные кнопки на компонент Tab */}
      <div className={styles.tabs}>
        <Tab
          value='bun'
          active={currentTab === 'bun'}
          onClick={() => onTabClick('bun')}
        >
          Булки
        </Tab>

        <Tab
          value='sauce'
          active={currentTab === 'sauce'}
          onClick={() => onTabClick('sauce')}
        >
          Соусы
        </Tab>

        <Tab
          value='main'
          active={currentTab === 'main'}
          onClick={() => onTabClick('main')}
        >
          Начинки
        </Tab>
      </div>

      <div className={styles.content}>
        <IngredientsCategory
          title='Булки'
          titleRef={titleBunRef}
          ingredients={buns}
          ref={bunsRef}
        />

        <IngredientsCategory
          title='Соусы'
          titleRef={titleSaucesRef}
          ingredients={sauces}
          ref={saucesRef}
        />

        <IngredientsCategory
          title='Начинки'
          titleRef={titleMainRef}
          ingredients={mains}
          ref={mainsRef}
        />
      </div>
    </section>
  )
);
