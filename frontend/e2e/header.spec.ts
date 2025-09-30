import { test, expect } from '@playwright/test';

test.describe('Header Fijo', () => {
  
  test('el header debería permanecer fijo al hacer scroll', async ({ page }) => {
    await page.goto('/');
    
    // Esperar a que el header se cargue
    const header = page.locator('.nav');
    await expect(header).toBeVisible();
    
    // Verificar que el header tiene position fixed
    const headerStyles = await header.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    expect(headerStyles.position).toBe('fixed');
    expect(headerStyles.top).toBe('0px');
    
    // Obtener la posición inicial del header
    const initialPosition = await header.boundingBox();
    
    // Hacer scroll hacia abajo
    await page.evaluate(() => window.scrollBy(0, 500));
    
    // Esperar un momento para que el scroll se complete
    await page.waitForTimeout(100);
    
    // Verificar que el header sigue en la misma posición
    const afterScrollPosition = await header.boundingBox();
    
    expect(afterScrollPosition?.y).toBe(initialPosition?.y);
    
    // Verificar que el header sigue siendo visible
    await expect(header).toBeVisible();
  });

  test('el header debería tener z-index alto', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('.nav');
    await expect(header).toBeVisible();
    
    // Verificar que el z-index es 9999
    const zIndex = await header.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    expect(parseInt(zIndex)).toBeGreaterThanOrEqual(9999);
  });

  test('el header debería tener fondo sólido', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('.nav');
    await expect(header).toBeVisible();
    
    // Verificar que tiene background-color
    const backgroundColor = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Debería tener un color de fondo definido (no transparente)
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(backgroundColor).not.toBe('transparent');
  });

});