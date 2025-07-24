# Spree Commerce demo store

This package allows Spree.spec.ts to execute the QE code challenge. 

Spree Commerce (https://demo.spreecommerce.org/) is an open-source eCommerce platform. It provides standard shopping workflows including user registration, product browsing, cart management, and checkout with payment capabilities.

## Minimum requirements

    - TypeScript: v.3.1.1
    - Node.js: v12.16
    - stripe-js 7.6.1
    - Playwright 1.0.0
    - "@playwright/test": "^1.54.1"
    - "@types/node": "^24.0.14"

## Installation

How to install Playwright
    - Install VS Code  https://code.visualstudio.com/download.
    - Choose which OS (Windows, Linux, Mac).
    - Open downloaded file and follow installation guide.
    - Open VS Code app and from the search box, do '>install playwright'
        - Select OK for default setup.

To clone:
    - git clone https://github.com/glenngaetos/MyGlobe.git
    - 'cd MyGlobe' Note: Choose folder location where to clone the project.

Installing Stripe.js:
    - Use `npm` to install the Stripe.js module
    - npm install @stripe/stripe-js

 Stripe Publishable Key: 
    pk_test_TYooMQauvdEDq54NiTphI7jx

## Technologies used
    - VS Code
    - Github
    - Node modules: Playwright, Stripe

## Extensions installed
    - Playwright Test for VSCode  v1.1.15 
    - GitHub Actions  v0.27.2
    - GitHub Copilot  v1.346.0 

## Test path
    - ../tests/spree.spec.ts

## Test
How to run the test suite fron VS Code.
    - Open spree.specs.ts and click the run test.

## UI Test Scenarios
1. Navigate to the Spree Commerce demo store.
2. Click on the user icon and Sign Up as a new user from the registration page from the side menu. (Log out if needed)
3. Log in with the newly registered user credentials.
4. Browse products and open a product detail page.
5. Add the product to cart.
6. Go to the cart and verify the product details (name, quantity, price).
7. Proceed to checkout and complete the following:
    ○ Add a shipping address.
    ○ Select a shipping method.
    ○ Verify the different delivery and pricing options.
    ○ Select a payment method. (Kindly refer test card details on the checkout)
    ○ Complete the order.
8. Verify the order confirmation page is shown with an order number and success message.
9. Add assertions at each key step (e.g., URL validation, UI messages, order confirmation, etc.).

## CI Integration
Integrate the created Playwright test automation framework in Gitlab or Github Pipelines and enable the test execution to be triggered from the pipeline.

    ../MyGlobe/.github/workflows/playwright.yml

## Test Environment used
    - MacOS (local)
    - chromium, webkit (safari)
    - Options: firefox, Edge

## Author
Glennuel Williams B. Gaetos
https://github.com/glenngaetos

## Resources

* https://playwright.dev/docs/intro
* https://docs.stripe.com/payments
* https://docs.stripe.com/js
