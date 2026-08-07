import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');

      document.cookie =
        'accessToken=test-access-token; path=/';
    });

    const ingredientsHar = path.resolve(
      process.cwd(),
      'tests/mocks/ingredients.har'
    );

    const userHar = path.resolve(
      process.cwd(),
      'tests/mocks/user.har'
    );

    const orderHar = path.resolve(
      process.cwd(),
      'tests/mocks/order.har'
    );

    await page.routeFromHAR(ingredientsHar, {
      url: '**/ingredients',
      update: false
    });

    await page.routeFromHAR(userHar, {
      url: '**/auth/user',
      update: false
    });

    await page.routeFromHAR(orderHar, {
      url: '**/orders',
      update: false
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

    const constructor = page.getByTestId('burger-constructor');

    await expect(
      constructor.getByText('Тестовая начинка', { exact: true })
    ).toBeVisible();
  });

  test('открывается модальное окно ингредиента с данными ингредиента', async ({
    page
  }) => {
    await page.getByText('Тестовая начинка', { exact: true }).first().click();

    await expect(
      page.getByText('Детали ингредиента')
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeVisible();

    await expect(page.getByText('250', { exact: true })).toBeVisible();
    await expect(page.getByText('20', { exact: true })).toBeVisible();
    await expect(page.getByText('15', { exact: true })).toBeVisible();
    await expect(page.getByText('5', { exact: true })).toBeVisible();
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

    const burgerConstructor = page.getByTestId('burger-constructor');

    await expect(
      burgerConstructor.getByText('Тестовая начинка', { exact: true })
    ).toBeVisible();

    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await expect(orderButton).toBeEnabled();

    await orderButton.click();

    await page.waitForTimeout(1000);

    const orderDetails = page.getByTestId('order-details');

    await expect(orderDetails).toBeVisible();

    await expect(
      orderDetails.getByText('12345', { exact: true })
    ).toBeVisible();

    await page.getByRole('button').last().click();

    await expect(
      orderDetails.getByText('12345', { exact: true })
    ).not.toBeVisible();

    await expect(
      burgerConstructor.getByText('Выберите начинку')
    ).toBeVisible();

    await expect(
      burgerConstructor.getByText('Выберите булки').first()
    ).toBeVisible();
  });
});