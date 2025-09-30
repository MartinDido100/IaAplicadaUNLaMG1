import { test, expect } from '@playwright/test';

test.describe('Navegación Básica', () => {
  
  test('debería cargar la página principal correctamente', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/MindFlix/);
    
    await expect(page.locator('nav')).toBeVisible();
    
    await expect(page.locator('.logo-cont h1')).toHaveText('MindFlix');
  });

  test('debería mostrar las películas populares en la página principal', async ({ page }) => {
    await page.goto('/');
    
    // Esperar a que las movie cards se carguen
    await page.waitForSelector('app-movie-card', { timeout: 10000 });
    
    // Verificar que hay al menos una movie card visible
    const movieCards = page.locator('app-movie-card');
    await expect(movieCards.first()).toBeVisible();
    
    // Verificar que las movie cards contienen información
    const firstCard = movieCards.first();
    await expect(firstCard.locator('img')).toBeVisible();
  });

});