import { FC, memo } from 'react';

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

      <div className={styles.tabs}>
        <button
          className={`text text_type_main-default ${
            currentTab === 'bun' ? styles.active : ''
          }`}
          onClick={() => onTabClick('bun')}
          type='button'
        >
          Булки
        </button>

        <button
          className={`text text_type_main-default ${
            currentTab === 'sauce' ? styles.active : ''
          }`}
          onClick={() => onTabClick('sauce')}
          type='button'
        >
          Соусы
        </button>

        <button
          className={`text text_type_main-default ${
            currentTab === 'main' ? styles.active : ''
          }`}
          onClick={() => onTabClick('main')}
          type='button'
        >
          Начинки
        </button>
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
