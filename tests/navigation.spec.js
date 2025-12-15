// tests/navigation.spec.js
const { test, expect } = require('@playwright/test');

test('użytkownik może przejść do strony logowania ze strony głównej', async ({ page }) => {
  // 1. Otwórz stronę główną (upewnij się, że aplikacja działa na porcie 3000)
  await page.goto('http://localhost:3000/');

  // 2. Kliknij w link "Zaloguj się".
  // Playwright poszuka elementu, który jest linkiem i ma tekst "Zaloguj się"
  await page.getByRole('link', { name: 'Zaloguj się' }).first().click();

  // 3. Sprawdź URL - czy zawiera "/user/signin"
  await expect(page).toHaveURL(/.*\/user\/signin/);

  // 4. Sprawdź czy na stronie jest widoczny nagłówek "Witaj ponownie!"
  // (Taki tekst znajduje się w Twoim pliku app/(public)/user/signin/page.js)
  await expect(page.getByRole('heading', { name: 'Witaj ponownie!' })).toBeVisible();
});