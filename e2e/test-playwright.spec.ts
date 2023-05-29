import { test, expect } from '@playwright/test';

test('TestPlaywrightComponent', async ({ page }) => {
    // Use the base URL from the configuration
    await page.goto('http://localhost:4200/tests/playwright');

    // Check if the component title is displayed
    const title = await page.textContent('h1');
    expect(title).toBe('Test Playwright Component');

    // Type a name into the input field
    await page.fill('#name', 'John Doe');

    // Click the button
    await page.click('button');

    // Check if the message is displayed with the correct name
    const message = await page.textContent('.message');
    expect(message).toBe('Hello, John Doe! You clicked the button.');
});
