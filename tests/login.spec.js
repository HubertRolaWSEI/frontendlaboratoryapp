// tests/login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Proces uwierzytelniania', () => {

  // DANE TESTOWE - upewnij się, że taki użytkownik istnieje w Twojej bazie!
  const testEmail = 'hubertrola@spoko.pl'; 
  const testPass = 'haslo123'; 

  test('poprawne logowanie przekierowuje do strony głównej', async ({ page }) => {
    // Przejdź do logowania
    await page.goto('http://localhost:3000/user/signin');

    // Wypełnij formularz (korzystamy z nazw pól 'name' w Twoim kodzie)
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPass);

    // Kliknij przycisk
    await page.getByRole('button', { name: 'Zaloguj się' }).click();

    // Oczekuj na przekierowanie na stronę główną po zalogowaniu
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Sprawdź czy po zalogowaniu widoczna jest opcja "Wyloguj" w menu
    // (W Twoim Sidebar.js przycisk "Wyloguj" pojawia się tylko dla zalogowanych)
    await expect(page.getByRole('link', { name: 'Wyloguj' }).first()).toBeVisible();
  });

  test('niezalogowany użytkownik jest blokowany przed wejściem na profil', async ({ page }) => {
    // Próba wejścia na chronioną podstronę bez logowania
    await page.goto('http://localhost:3000/user/profile');

    // Oczekiwanie przekierowania do logowania (z parametrem returnUrl)
    await expect(page).toHaveURL(/.*\/user\/signin/);

    // Potwierdzenie, że widzimy formularz logowania
    await expect(page.getByRole('heading', { name: 'Witaj ponownie!' })).toBeVisible();
  });
});