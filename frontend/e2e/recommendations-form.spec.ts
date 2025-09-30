import { test, expect } from '@playwright/test';

test.describe('Formulario de Recomendaciones', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navegar a la sección de recomendaciones si no está visible
    await page.locator('.recommendations').scrollIntoViewIfNeeded();
  });

  test('debería mostrar el formulario de recomendaciones', async ({ page }) => {
    // Verificar que el formulario está presente
    await expect(page.locator('.ia-form')).toBeVisible();
    
    // Verificar que tiene el textarea principal
    await expect(page.locator('textarea[formControlName="textPrompt"]')).toBeVisible();
    
    // Verificar que muestra los checkboxes de géneros
    await expect(page.locator('.form-field').filter({ hasText: 'Genero de la pelicula' })).toBeVisible();
    
    // Verificar que muestra los checkboxes de estado de ánimo
    await expect(page.locator('.form-field').filter({ hasText: 'Estado de ánimo' })).toBeVisible();
  });

  test('debería permitir escribir en el textarea principal', async ({ page }) => {
    const textarea = page.locator('textarea[formControlName="textPrompt"]');
    
    await textarea.fill('Me siento aventurero y quiero una película de acción');
    
    await expect(textarea).toHaveValue('Me siento aventurero y quiero una película de acción');
  });

  test('debería permitir seleccionar checkboxes de géneros', async ({ page }) => {
    // Encontrar el primer checkbox de género
    const genreCheckbox = page.locator('input[name="genre"]').first();
    
    // Verificar que inicialmente no está marcado
    await expect(genreCheckbox).not.toBeChecked();
    
    // Hacer clic para marcarlo
    await genreCheckbox.click();
    
    // Verificar que ahora está marcado
    await expect(genreCheckbox).toBeChecked();
    
    // Verificar que el label cambia de estilo cuando está checked
    const label = genreCheckbox.locator('..'); // Parent label
    const backgroundColor = await label.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Debería tener el color primary cuando está checked
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('debería permitir seleccionar múltiples checkboxes de estado de ánimo', async ({ page }) => {
    // Seleccionar varios checkboxes de mood
    const moodCheckboxes = page.locator('input[name="mood"]');
    const firstMood = moodCheckboxes.first();
    const secondMood = moodCheckboxes.nth(1);
    
    await firstMood.click();
    await secondMood.click();
    
    // Verificar que ambos están marcados
    await expect(firstMood).toBeChecked();
    await expect(secondMood).toBeChecked();
  });

  test('debería permitir seleccionar radiobuttons de duración', async ({ page }) => {
    // Buscar los radiobuttons de duración
    const durationRadios = page.locator('input[name="duration"]');
    
    if (await durationRadios.count() > 0) {
      const firstDuration = durationRadios.first();
      
      await firstDuration.click();
      await expect(firstDuration).toBeChecked();
    }
  });

  test('formulario completo debería ser válido antes del submit', async ({ page }) => {
    // Llenar todos los campos requeridos
    await page.fill('textarea[formControlName="textPrompt"]', 'Quiero una película divertida');
    
    // Seleccionar al menos un género
    await page.locator('input[name="genre"]').first().click();
    
    // Seleccionar al menos un mood
    await page.locator('input[name="mood"]').first().click();
    
    // Verificar que el botón de submit está habilitado
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('debería mostrar spinner al enviar el formulario', async ({ page }) => {
    // Llenar el formulario
    await page.fill('textarea[formControlName="textPrompt"]', 'Quiero una película de comedia');
    await page.locator('input[name="genre"]').first().click();
    await page.locator('input[name="mood"]').first().click();
    
    // Interceptar la petición para que no falle
    await page.route('**/recommendations/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ recommendations: [] })
      });
    });
    
    // Hacer submit
    await page.click('button[type="submit"]');
    
    // Verificar que aparece el spinner
    await expect(page.locator('app-spinner')).toBeVisible({ timeout: 5000 });
  });

});