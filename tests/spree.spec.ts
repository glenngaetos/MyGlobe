// @ts-check
import { test, expect } from '@playwright/test';
import { loadStripe } from '@stripe/stripe-js';

test('Spree Commerce demo store', async ({ page }) => {
  
  // Generate a unique dummy email address
  const timestamp = Date.now();
  const email = `testglenn${timestamp}@gmail.com`;
  const password = 'Test@12345';
  
  // Sign Up page.
  await page.goto('https://demo.spreecommerce.org/');
  await page.getByRole('navigation', { name: 'Top' }).getByRole('img').nth(2).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('heading', { name: 'Sign Up' }).click();

  // Sign-up form.
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.getByRole('textbox', { name: 'Password Confirmation' }).fill(password);

  // Click the sign-up button.
  await page.getByRole('button', { name: 'Sign Up' }).click();

  // Expect a success message.
  await expect(page.getByText('Welcome! You have signed up')).toBeVisible();
  await page.getByText('Welcome! You have signed up').click();

  //Logout after sign-up
  await page.locator('.hidden > a').first().click();
  await page.getByRole('button', { name: 'Log out' }).click();

  //Login flow
  await page.goto('https://demo.spreecommerce.org/');
  await expect(page.getByLabel('Top')).toMatchAriaSnapshot(`- img`);
  await page.getByRole('navigation', { name: 'Top' }).getByRole('img').nth(2).click();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
  await page.getByText('Signed in successfully.').click();

  //Browse products and open a product detail page.
  await page.locator('#block-6474').getByRole('link', { name: 'Shop All' }).click();
  await page.getByRole('link', { name: 'Sale Ripped T-Shirt $55.99 $' }).click();

  //Add the product to cart.
  await page.getByRole('group').filter({ hasText: 'Color: Grey' }).locator('div').nth(3).click();
  await page.locator('#product-variant-picker').getByRole('button', { name: 'PLEASE CHOOSE SIZE' }).click();
  await page.locator('#product-variant-picker label').filter({ hasText: 'M' }).click();

  const button = page.getByRole('button', { name: 'Add To Cart' });
  await expect(button).toBeVisible({ timeout: 60000 });
  await expect(button).toBeEnabled();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  
  //Go to the cart and verify the product details (name, quantity, price).
  const cartItem = page.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'Ripped T-Shirt' }) });
  await expect(cartItem).toBeVisible({ timeout: 30000 });
  await expect(cartItem).toContainText('$');
  await expect(page.locator('#line_item_quantity')).toHaveValue('1');

  //Proceed to checkout
  await page.getByRole('link', { name: 'Checkout' }).click();

  //Add a shipping address
  const textbox = page.getByRole('textbox', { name: 'First name' });
  await expect(textbox).toBeVisible({ timeout: 30000 });
  await expect(textbox).toBeEnabled();
  await expect(page.locator('#sfirstname')).toMatchAriaSnapshot(`
    - text: First name
    - textbox "First name"`);
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Glenn');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Gaetos');
  await page.getByRole('textbox', { name: 'Street and house number' }).click();
  await page.getByRole('textbox', { name: 'Street and house number' }).fill('123 Ayala Avenue');
  await page.getByRole('textbox', { name: 'Street and house number' }).press('Tab');
  await page.getByRole('textbox', { name: 'Apartment, suite, etc. (' }).press('Tab');
  await page.getByRole('textbox', { name: 'City' }).fill('Pennsylvania');
  await page.getByRole('textbox', { name: 'City' }).press('Tab');
  await page.locator('#order_ship_address_attributes_state_id').press('Tab');
  await page.getByRole('textbox', { name: 'Postal Code' }).fill('12345');
  await page.getByRole('button', { name: 'Save and Continue' }).click();

  //Select a shipping method.
  ({delay: 30000});
  await page.getByRole('radio', { name: 'Premium Delivery in 2-3' }).click();
  await page.getByRole('button', { name: 'Save and Continue' }).click();

  //Verify the different delivery and pricing options.
  await page.getByText('Standard Delivery in 3-5 business days $').focus();
  await page.getByText('Premium Delivery in 2-3 business days $').focus();
  await page.getByText('Next Day Delivery in 1-2 business days $').focus();

  //Select a payment method.
  await expect(page.locator('#checkout div').filter({ hasText: 'Ship Address ' }).nth(1)).toBeVisible();
  ({delay: 30000});

  // Publishable key from Stripe dashboard
  const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
  const initializeStripeElements = async () => {
  const stripe = await stripePromise;
  };

  // Wait for the iframe to load (assuming it's a Stripe or Adyen card iframe)
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first()).toBeVisible();

  // Wait for the card number field to be visible and interactable
  // Find the visible Stripe iframe containing the card input
  const stripeIframes = await page.locator('iframe[name*="__privateStripeFrame"]').elementHandles();
    let cardFrameLocator;
    for (const iframe of stripeIframes) {
  const boundingBox = await iframe.boundingBox();
    if (boundingBox) {
  // This iframe is visible
    cardFrameLocator = page.frameLocator(`iframe[name="${await iframe.getAttribute('name')}"]`);
    break;
    }
  }
    if (!cardFrameLocator) {
    throw new Error('No visible Stripe card iframe found');
  }
  await page.locator('#order_payments_attributes__payment_method_id_25').check();
  await cardFrameLocator.getByRole('textbox', { name: 'Card number' }).fill('4242 4242 4242 4242');
  await cardFrameLocator.getByRole('textbox', { name: 'Expiration date MM / YY' }).fill('12 / 30');
  await cardFrameLocator.getByRole('textbox', { name: 'Security code' }).fill('123');

  // Fill in 1-click checkout with Link
  const cardFrameHandle = stripeIframes.find(async iframe => {
  const frame = await iframe.contentFrame();
    if (!frame) return false;
    try {
  // Try to locate the card number field inside this frame
    return await frame.getByRole('textbox', { name: 'Card number' }).isVisible();
    } catch {
    return false;
    }
  });
  const cardFrame = await (await cardFrameHandle)?.contentFrame();
    if (!cardFrame) throw new Error('Could not find Stripe card input frame for email/mobile fields');

  await cardFrame.getByRole('textbox', { name: 'Email' }).fill(email);
  await cardFrame.getByRole('textbox', { name: 'Mobile number' }).fill('0917 123 4567');
  //await cardFrame.getByRole('textbox', { name: 'Mobile number' }).press('Tab');
  await cardFrame.getByRole('textbox', { name: 'Full name' }).fill('Glenn Gaetos');

  //Complete the order.
  await page.getByRole('button', { name: 'Pay now' }).click();

  //Verify the order confirmation page is shown with an order number and success message.
  await expect(page.getByRole('heading', { name: /Thanks .* for your order!/i })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Your order is confirmed/i)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: /Order .*/i })).toBeVisible({ timeout: 15000 });
});
