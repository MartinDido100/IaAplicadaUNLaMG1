import { test, expect, Page } from '@playwright/test';

// Helper function para llenar el formulario de recomendaciones
async function fillRecommendationForm(page: Page, prompt: string) {
  console.log('Llenando formulario con prompt:', prompt);
  
  // Buscar el textarea
  const textarea = page.locator('textarea').first();
  await textarea.waitFor({ timeout: 15000 });
  await textarea.fill(prompt);
  
  // Esperar y marcar al menos un checkbox de género
  await page.waitForTimeout(1000);

  const genreLabel = page.locator('label').filter({ hasText: 'Acción' }).first();
  await genreLabel.waitFor({ timeout: 10000 });
  await genreLabel.scrollIntoViewIfNeeded();
  await genreLabel.click();

  // Encontrar y hacer clic en el botón de submit
  const submitButton = page.locator('button').filter({ hasText: /buscar|enviar|submit|recomendar/i });
  
  await submitButton.first().waitFor({ timeout: 10000 });
  await submitButton.first().scrollIntoViewIfNeeded();
  await submitButton.first().click();
  console.log('Formulario enviado');
}

test.describe('Modal de Recomendaciones', () => {
  
  test.beforeEach(async ({ page }) => {
    // Interceptar la llamada a géneros para que se carguen inmediatamente
    await page.route('**/genre/movie/list/**', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          genres: [
            { id: 28, name: 'Acción' },
            { id: 35, name: 'Comedia' },
            { id: 18, name: 'Drama' },
            { id: 27, name: 'Terror' },
            { id: 878, name: 'Ciencia ficción' }
          ]
        })
      });
    });

    // Simular usuario logueado agregando datos al localStorage
    await page.addInitScript(() => {
      const mockUser = {
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Usuario Test'
        }
      };
      localStorage.setItem('loggedUser', JSON.stringify(mockUser));
    });

    await page.goto('/');
    
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Hacer scroll hacia abajo para encontrar el formulario
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight * 0.8);
    });
    await page.waitForTimeout(2000);
  });

  test('debería abrir el modal cuando se envía el formulario', async ({ page }) => {
    // Interceptar peticiones de autenticación si las hay
    await page.route('**/auth/**', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          success: true,
          user: { id: '1', email: 'test@example.com', name: 'Usuario Test' }
        })
      });
    });

    // Interceptar la petición para simular respuesta exitosa
    await page.route('**/api/recommendations', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          movies: [
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
    
    // Llenar y enviar el formulario usando el helper
    await fillRecommendationForm(page, 'Quiero una película de aventuras');
    
    // Verificar que aparece el overlay del modal
    await expect(page.locator('.cdk-overlay-backdrop')).toBeVisible({ timeout: 10000 });
    
    // Verificar que aparece el contenido del modal
    await expect(page.locator('.cdk-dialog-container')).toBeVisible();
    
    // Verificar que el modal contiene el título esperado
    await expect(page.locator('.wrapper .title')).toContainText('Tus Peliculas Perfectas');
  });

  test('debería mostrar las recomendaciones en el modal', async ({ page }) => {
    // Interceptar auth
    await page.route('**/auth/**', route => {
      route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // Mock con datos más realistas
    await page.route('**/api/recommendations', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          movies: [
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
              overview: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de compartir sueños recibe la tarea inversa de plantar una idea in la mente de un CEO.',
              poster_path: '/inception-poster.jpg',
              vote_average: 8.8,
              release_date: '2010-07-16'
            }
          ]
        })
      });
    });
    
    // Llenar y enviar formulario
    await fillRecommendationForm(page, 'Películas épicas de ciencia ficción');
    
    // Esperar a que aparezca el modal
    await expect(page.locator('.cdk-dialog-container')).toBeVisible({ timeout: 10000 });
    
    // Verificar que muestra las movie cards en el modal
    await expect(page.locator('.movie-card')).toHaveCount(2);
    
    // Verificar que los títulos están presentes
    await expect(page.locator('.wrapper .movie-title').first()).toContainText('Inception');
    await expect(page.locator('.wrapper .movie-title').nth(1)).toContainText('Avatar');
    
    // Verificar que las descripciones están presentes
    await expect(page.locator('.wrapper .movie-description').first()).toContainText('ladrón');
  });

  test('debería poder cerrar el modal haciendo clic en el backdrop', async ({ page }) => {
    // Interceptar auth
    await page.route('**/auth/**', route => {
      route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // Interceptar y abrir modal
    await page.route('**/api/recommendations', route => {
      console.log('Interceptando request a:', route.request().url());
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          movies: [{ 
            id: 1, title: 'Test', overview: 'Test', poster_path: '/test.jpg' 
          }] 
        })
      });
    });
    
    await fillRecommendationForm(page, 'Test');
    
    // Esperar a que aparezca
    await expect(page.locator('.cdk-overlay-backdrop')).toBeVisible();
    
    // Hacer clic en el backdrop para cerrar
    await page.locator('.cdk-overlay-backdrop').click({ position: { x: 10, y: 10 } });
    
    // Verificar que el modal se cierra
    await expect(page.locator('.cdk-overlay-backdrop')).not.toBeVisible({ timeout: 5000 });
  });

  test('debería manejar respuestas vacías correctamente', async ({ page }) => {
    // Interceptar auth
    await page.route('**/auth/**', route => {
      route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // Mock con respuesta vacía
    await page.route('**/api/recommendations', route => {
      console.log('Interceptando request a:', route.request().url());
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ movies: [] })
      });
    });
    
    // Llenar formulario
    await fillRecommendationForm(page, 'Algo muy específico');
    
    // El modal debería abrirse incluso sin resultados
    await expect(page.locator('.cdk-dialog-container')).toBeVisible({ timeout: 10000 });
    
    // No debería haber movie cards
    await expect(page.locator('.movie-card')).toHaveCount(0);
  });

});