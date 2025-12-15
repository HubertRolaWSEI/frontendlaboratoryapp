// tests/register.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Rejestracja użytkownika', () => {

  test('pokazuje błąd gdy hasła się nie zgadzają', async ({ page }) => {
    // 1. Wejdź na stronę rejestracji
    await page.goto('http://localhost:3000/user/register');

    // 2. Wypełnij formularz błędnymi danymi (hasła są różne)
    // Używamy nazw pól 'name' z Twojego pliku register/page.js
    await page.fill('input[name="email"]', 'zlehasla@test.pl');
    await page.fill('input[name="password"]', 'haslo123');
    await page.fill('input[name="passwordConfirm"]', 'innehaslo'); // Błąd celowy

    // 3. Kliknij przycisk "Zarejestruj się"
    await page.getByRole('button', { name: 'Zarejestruj się' }).click();

    // 4. Sprawdź, czy wyświetlił się komunikat błędu
    // W pliku app/(public)/user/register/page.js błąd to tekst: "Hasła nie pasują do siebie"
    await expect(page.getByText('Hasła nie pasują do siebie')).toBeVisible();
  });

  test('pozwala zarejestrować nowe konto', async ({ page }) => {
    // Generujemy unikalny email (np. test173428999@test.pl), 
    // żeby Firebase nie wyrzucił błędu "Email already in use".
    const uniqueEmail = `test${Date.now()}@test.pl`;

    await page.goto('http://localhost:3000/user/register');

    // 1. Wypełnij poprawne dane
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'haslo123');
    await page.fill('input[name="passwordConfirm"]', 'haslo123');

    // 2. Kliknij przycisk
    await page.getByRole('button', { name: 'Zarejestruj się' }).click();

// 3. Sprawdź przekierowanie do strony weryfikacji
    await expect(page).toHaveURL(/.*\/user\/verify/);
    
    // 4. Sprawdź czy na stronie weryfikacji widać nasz e-mail
    // POPRAWKA: Szukamy tekstu tylko wewnątrz znacznika <main>, aby pominąć Sidebar i Navbar
    await expect(page.locator('main').getByText(uniqueEmail)).toBeVisible();
    
    await expect(page.getByRole('heading', { name: 'Weryfikacja Email' })).toBeVisible();
  });

});