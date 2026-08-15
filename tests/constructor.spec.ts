import { test, expect } from '@playwright/test';

const mockIngredients = {
  success: true,
  data: [
    { _id: '1', name: 'Краторная булка N-200i', type: 'bun', price: 1255 },
    { _id: '2', name: 'Биокотлета из марсианской Магнолии', type: 'main', price: 424 },
    { _id: '3', name: 'Соус фирменный Space Sauce', type: 'sauce', price: 80 }
  ]
};
const mockUser = { user: { name: 'Test User', email: 'test@test.com' } };
const mockOrder = { order: { number: 777777 } };

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(mockIngredients) });
    });
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(mockUser) });
    });
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(mockOrder) });
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/; secure';
    });

    await page.goto('http://localhost:4000');
    await page.waitForSelector('a', { timeout: 10000 });
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const firstIngredientLink = page.locator('a').first();
    await firstIngredientLink.click();

    // Ищем модалку по заголовку (это 100% надёжно)
    const modal = page.locator('div', { hasText: 'Детали ингредиента' });
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Закрываем по крестику (ищем кнопку/иконку внутри модалки)
    // Если у крестика есть класс, замени '.modal__close' на него.
    // Если класса нет, ищем по роли 'button' или просто по клику на иконку
    await modal.getByRole('button', { name: /закрыть|close/i }).click();
    // ИЛИ если кнопка внутри модалки без текста:
    // await modal.locator('button').click();
    
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('добавление ингредиента в конструктор', async ({ page }) => {
    await page.locator('a').first().click();
    await expect(page.locator('.constructor_element')).toBeVisible({ timeout: 5000 });
  });

  test('создание заказа и очистка конструктора', async ({ page }) => {
    await page.locator('a').first().click(); // булка
    await page.locator('a').nth(1).click(); // начинка

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('div', { hasText: 'идентификатор заказа' });
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal).toContainText('777777');

    await modal.getByRole('button', { name: /закрыть|close/i }).click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });

    await expect(page.locator('.constructor_element')).not.toBeVisible({ timeout: 5000 });
  });
});
