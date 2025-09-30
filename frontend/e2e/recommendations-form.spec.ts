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

  console.log('Formulario llenado correctamente');
}

test.describe('Formulario de Recomendaciones', () => {
  
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

  test('debería mostrar el formulario de recomendaciones', async ({ page }) => {
    // Verificar que el formulario está presente
    await expect(page.locator('.ia-form')).toBeVisible();
    
    // Verificar que tiene el textarea principal
    await expect(page.locator('textarea[formControlName="textPrompt"]')).toBeVisible();
    
    // Verificar que muestra los checkboxes de géneros
    await expect(page.locator('.form-field').filter({ hasText: 'Genero de la pelicula' })).toBeVisible();
    
    // Verificar que muestra los checkboxes de estado de ánimo
    await expect(page.locator('.form-field').nth(1)).toBeVisible();

    // Verificar que muestra los checkboxes de duración
    await expect(page.locator('.form-field').filter({ hasText: 'Duración de la película' })).toBeVisible();
  });

  test('debería permitir escribir en el textarea principal', async ({ page }) => {
    const textarea = page.locator('textarea[formControlName="textPrompt"]');
    
    await textarea.fill('Me siento aventurero y quiero una película de acción');
    
    await expect(textarea).toHaveValue('Me siento aventurero y quiero una película de acción');
  });

  test('debería permitir seleccionar checkboxes de géneros', async ({ page }) => {
    // Usar el método que funciona: hacer clic en el label en lugar del checkbox
    const genreLabel = page.locator('label').filter({ hasText: 'Acción' }).first();
    const genreCheckbox = page.locator('input[name="genre"]').first();
    
    // Verificar que inicialmente no está marcado
    await expect(genreCheckbox).not.toBeChecked();
    
    // Hacer clic en el label (método que funciona)
    await genreLabel.waitFor({ timeout: 10000 });
    await genreLabel.scrollIntoViewIfNeeded();
    await genreLabel.click();
    
    // Verificar que ahora está marcado
    await expect(genreCheckbox).toBeChecked();
    
    // Verificar que el label cambia de estilo cuando está checked
    const backgroundColor = await genreLabel.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Debería tener el color primary cuando está checked
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('debería permitir seleccionar múltiples checkboxes de estado de ánimo', async ({ page }) => {
    // Usar labels en lugar de inputs directos
    const moodLabels = page.locator('label').filter({ hasText: /feliz|triste|emocionado|relajado/i });
    const moodCheckboxes = page.locator('input[name="mood"]');
    
    const firstMoodLabel = moodLabels.first();
    const secondMoodLabel = moodLabels.nth(1);
    const firstMood = moodCheckboxes.first();
    const secondMood = moodCheckboxes.nth(1);
    
    await firstMoodLabel.scrollIntoViewIfNeeded();
    await firstMoodLabel.click();
    await secondMoodLabel.scrollIntoViewIfNeeded();
    await secondMoodLabel.click();
    
    // Verificar que ambos están marcados
    await expect(firstMood).toBeChecked();
    await expect(secondMood).toBeChecked();
  });

  test('debería permitir seleccionar checkboxes de duración', async ({ page }) => {
    // Usar labels en lugar de inputs directos para duración
    const durationLabels = page.locator('label').filter({ hasText: "Corta" });
    const durationCheckboxes = page.locator('input[name="duration"]');
    
    if (await durationLabels.count() > 0) {
      const firstDurationLabel = durationLabels.first();
      const firstDuration = durationCheckboxes.first();

      await firstDurationLabel.scrollIntoViewIfNeeded();
      await firstDurationLabel.click();
      await expect(firstDuration).toBeChecked();
    }
  });

  test('formulario completo debería ser válido antes del submit', async ({ page }) => {
    // Usar el helper function para llenar el formulario
    await fillRecommendationForm(page, 'Quiero una película divertida');
    
    // Verificar que el botón de submit está habilitado
    const submitButton = page.locator('button').filter({ hasText: /buscar|enviar|submit|recomendar/i });
    await expect(submitButton.first()).toBeEnabled();
  });

  test('debería mostrar spinner al enviar el formulario', async ({ page }) => {
    // Interceptar peticiones de autenticación
    await page.route('**/auth/**', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: true })
      });
    });

    // Interceptar la petición para que no falle pero tarde un poco en responder
    await page.route('**/api/recommendations', route => {
      // Simular delay para poder ver el spinner
      setTimeout(() => {
        route.fulfill({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ movies: [] })
        });
      }, 1000);
    });
    
    // Usar el helper function para llenar el formulario
    await fillRecommendationForm(page, 'Quiero una película de comedia');
    
    // Hacer submit
    const submitButton = page.locator('button').filter({ hasText: /buscar|enviar|submit|recomendar/i });
    await submitButton.first().waitFor({ timeout: 10000 });
    await submitButton.first().scrollIntoViewIfNeeded();
    await submitButton.first().click();
    
    // Verificar que aparece el spinner
    await expect(page.locator('app-spinner')).toBeVisible({ timeout: 5000 });
  });

  test('debería abrir el modal de recomendaciones al enviar formulario completo', async ({ page }) => {
    // Interceptar peticiones de autenticación
    await page.route('**/auth/**', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: true })
      });
    });

    // Interceptar la API de recomendaciones
    await page.route('**/api/recommendations', route => {
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          movies: [
            {
              id: 1,
              title: 'Test Movie',
              overview: 'Esta es una película de prueba para el formulario',
              poster_path: '/test-poster.jpg',
              vote_average: 8.5,
              release_date: '2023-01-01'
            }
          ]
        })
      });
    });
    
    // Llenar y enviar el formulario usando el helper
    await fillRecommendationForm(page, 'Quiero una película emocionante');
    
    // Hacer submit
    const submitButton = page.locator('button').filter({ hasText: /buscar|enviar|submit|recomendar/i });
    await submitButton.first().waitFor({ timeout: 10000 });
    await submitButton.first().scrollIntoViewIfNeeded();
    await submitButton.first().click();
    
    // Verificar que aparece el modal con las recomendaciones
    await expect(page.locator('.cdk-overlay-backdrop')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.cdk-dialog-container')).toBeVisible();
    
    // Verificar que el modal contiene el contenido esperado
    await expect(page.locator('.wrapper .title')).toContainText('Tus Peliculas Perfectas');
    await expect(page.locator('.movie-card')).toHaveCount(1);
    await expect(page.locator('.wrapper .movie-title').first()).toContainText('Test Movie');
  });

});