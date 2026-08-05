import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    const harPath = path.resolve(
      process.cwd(),
      'tests/mocks/ingredients.har'
    );

    await page.routeFromHAR(harPath, {
      url: '**/ingredients',
      update: false
    });

    await page.route('**/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@test.ru',
            name: 'Тестовый пользователь'
          }
        })
      });
    });

    await page.route('**/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Тестовый бургер',
          order: {
            number: 12345
          }
        })
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');

      document.cookie =
        'accessToken=test-access-token; path=/';
    });

    await page.goto('/');
  });

  test('загружает моковые ингредиенты из HAR-файла', async ({ page }) => {
    await expect(page.getByText('Тестовая булка')).toBeVisible();
    await expect(page.getByText('Тестовая начинка')).toBeVisible();
    await expect(page.getByText('Тестовый соус')).toBeVisible();
  });

  test('добавляет ингредиент в конструктор', async ({ page }) => {
    const ingredientCard = page
      .getByText('Тестовая начинка', { exact: true })
      .locator('xpath=ancestor::li');

    await ingredientCard.getByText('Добавить').click();

    await expect(
      page.getByText('Тестовая начинка', { exact: true }).last()
    ).toBeVisible();
  });

  test('открывается модальное окно ингредиента', async ({ page }) => {
    await page.getByText('Тестовая начинка', { exact: true }).click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();
  });

  test('закрывается модальное окно ингредиента по крестику', async ({
    page
  }) => {
    await page.getByText('Тестовая начинка', { exact: true }).click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByRole('button').last().click();

    await expect(
      page.getByText('Детали ингредиента')
    ).not.toBeVisible();
  });

  test('закрывается модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page.getByText('Тестовая начинка', { exact: true }).click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });

    await expect(
      page.getByText('Детали ингредиента')
    ).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    const bunCard = page
      .getByText('Тестовая булка', { exact: true })
      .locator('xpath=ancestor::li');

    await bunCard.getByText('Добавить').click();

    const ingredientCard = page
      .getByText('Тестовая начинка', { exact: true })
      .locator('xpath=ancestor::li');

    await ingredientCard.getByText('Добавить').click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345')).toBeVisible();

    await page.getByRole('button').last().click();

    await expect(page.getByText('12345')).not.toBeVisible();

    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});