import { test, expect } from '@playwright/test';

test.describe('Modal de Recomendaciones', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ir a la sección de recomendaciones
    await page.locator('.recommendations').scrollIntoViewIfNeeded();
  });

  test('debería abrir el modal cuando se envía el formulario', async ({ page }) => {
    // Interceptar la petición para simular respuesta exitosa
    await page.route('**/recommendations/**', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          recommendations: [
            {
              id: 1,
              title: 'Test Movie',
              overview: 'Esta es una película de prueba',
              poster_path: '/test-poster.jpg',
              vote_average: 8.5,
              release_date: '2023-01-01'
            }
          ]
        })
      });
    });
    
    // Llenar y enviar el formulario
    await page.fill('textarea[formControlName="textPrompt"]', 'Quiero una película de aventuras');
    await page.locator('input[name="genre"]').first().click();
    await page.locator('input[name="mood"]').first().click();
    
    // Enviar formulario
    await page.click('button[type="submit"]');
    
    // Verificar que aparece el overlay del modal
    await expect(page.locator('.cdk-overlay-backdrop')).toBeVisible({ timeout: 10000 });
    
    // Verificar que aparece el contenido del modal
    await expect(page.locator('.cdk-dialog-container')).toBeVisible();
    
    // Verificar que el modal contiene el título esperado
    await expect(page.locator('.title')).toContainText('Tus Peliculas Perfectas');
  });

  test('el modal debería tener z-index superior al header', async ({ page }) => {
    // Interceptar petición y simular respuesta
    await page.route('**/recommendations/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ recommendations: [{ 
          id: 1, title: 'Test', overview: 'Test', poster_path: '/test.jpg' 
        }] })
      });
    });
    
    // Abrir el modal
    await page.fill('textarea[formControlName="textPrompt"]', 'Test');
    await page.locator('input[name="mood"]').first().click();
    await page.click('button[type="submit"]');
    
    // Esperar a que aparezca el modal
    await page.waitForSelector('.cdk-overlay-pane', { timeout: 10000 });
    
    // Obtener z-index del header
    const headerZIndex = await page.locator('.nav').evaluate(el => 
      parseInt(window.getComputedStyle(el).zIndex)
    );
    
    // Obtener z-index del overlay del modal
    const modalZIndex = await page.locator('.cdk-overlay-pane').evaluate(el => 
      parseInt(window.getComputedStyle(el).zIndex)
    );
    
    // El modal debería tener z-index mayor que el header
    expect(modalZIndex).toBeGreaterThan(headerZIndex);
    expect(modalZIndex).toBeGreaterThanOrEqual(10001);
  });

  test('debería mostrar las recomendaciones en el modal', async ({ page }) => {
    // Mock con datos más realistas
    await page.route('**/recommendations/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          recommendations: [
            {
              id: 1,
              title: 'Avatar',
              overview: 'Un marine parapléjico enviado a la luna Pandora en una misión única se debate entre seguir las órdenes y proteger al mundo que siente como su hogar.',
              poster_path: '/avatar-poster.jpg',
              vote_average: 7.8,
              release_date: '2009-12-18'
            },
            {
              id: 2,
              title: 'Inception',
              overview: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de compartir sueños recibe la tarea inversa de plantar una idea en la mente de un CEO.',
              poster_path: '/inception-poster.jpg',
              vote_average: 8.8,
              release_date: '2010-07-16'
            }
          ]
        })
      });
    });
    
    // Llenar y enviar formulario
    await page.fill('textarea[formControlName="textPrompt"]', 'Películas épicas de ciencia ficción');
    await page.locator('input[name="mood"]').first().click();
    await page.click('button[type="submit"]');
    
    // Esperar a que aparezca el modal
    await expect(page.locator('.cdk-dialog-container')).toBeVisible({ timeout: 10000 });
    
    // Verificar que muestra las movie cards en el modal
    await expect(page.locator('.movie-card')).toHaveCount(2);
    
    // Verificar que los títulos están presentes
    await expect(page.locator('.movie-title').first()).toContainText('Avatar');
    await expect(page.locator('.movie-title').nth(1)).toContainText('Inception');
    
    // Verificar que las descripciones están presentes
    await expect(page.locator('.movie-description').first()).toContainText('Pandora');
  });

  test('debería poder cerrar el modal haciendo clic en el backdrop', async ({ page }) => {
    // Interceptar y abrir modal
    await page.route('**/recommendations/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ recommendations: [{ 
          id: 1, title: 'Test', overview: 'Test', poster_path: '/test.jpg' 
        }] })
      });
    });
    
    await page.fill('textarea[formControlName="textPrompt"]', 'Test');
    await page.locator('input[name="mood"]').first().click();
    await page.click('button[type="submit"]');
    
    // Esperar a que aparezca
    await expect(page.locator('.cdk-overlay-backdrop')).toBeVisible();
    
    // Hacer clic en el backdrop para cerrar
    await page.locator('.cdk-overlay-backdrop').click({ position: { x: 10, y: 10 } });
    
    // Verificar que el modal se cierra
    await expect(page.locator('.cdk-overlay-backdrop')).not.toBeVisible({ timeout: 5000 });
  });

  test('debería manejar respuestas vacías correctamente', async ({ page }) => {
    // Mock con respuesta vacía
    await page.route('**/recommendations/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ recommendations: [] })
      });
    });
    
    // Llenar y enviar formulario
    await page.fill('textarea[formControlName="textPrompt"]', 'Algo muy específico');
    await page.locator('input[name="mood"]').first().click();
    await page.click('button[type="submit"]');
    
    // El modal debería abrirse incluso sin resultados
    await expect(page.locator('.cdk-dialog-container')).toBeVisible({ timeout: 10000 });
    
    // No debería haber movie cards
    await expect(page.locator('.movie-card')).toHaveCount(0);
  });

});