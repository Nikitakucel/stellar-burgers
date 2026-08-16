import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Используем HAR-файл
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      update: false,
      notFound: 'abort'
    });

    // Фейковые токены
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/; secure';
    });

    await page.goto('http://localhost:4000');
    await page.waitForSelector('a');
  });

  test('добавление ингредиента', async ({ page }) => {
    await page.locator('a').first().click();
    await expect(page.locator('.constructor_element')).toBeVisible();
  });

  test('модальное окно', async ({ page }) => {
    await page.locator('a').first().click();
    const modal = page.locator('div', { hasText: 'Детали ингредиента' });
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('заказ и очистка', async ({ page }) => {
    await page.locator('a').first().click();
    await page.locator('a').nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('div', { hasText: 'идентификатор заказа' });
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('777777');

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    await expect(page.locator('.constructor_element')).not.toBeVisible();
  });
});
