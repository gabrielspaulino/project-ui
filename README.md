# project-ui

This is a front-end application for an e-commerce platform, built with Vue 3 and Vite. It provides a user interface for browsing products, managing a shopping cart, comparing items, and handling user authentication.

## Features

- **User Authentication:** Secure user sign-up and login functionality using JWT.
- **Product Browsing:** View a list of products and see detailed information for each item.
- **Product Comparison:** Select and compare specifications of different products side-by-side.
- **Shopping Cart:** Add products to a cart and proceed to checkout.
- **Order History:** Authenticated users can view their past orders and order details.
- **Client-Side Routing:** A seamless, single-page application experience powered by Vue Router.
- **State Management:** Centralized state management for cart, authentication, and products using Pinia.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A running instance of the corresponding backend server on `http://localhost:8080`. The application proxies API requests from `/api` to this address.

## Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory:
    ```sh
    cd project-ui
    ```
3.  Install the necessary dependencies:
    ```sh
    npm install
    ```

## Usage

### Development Server

To run the application in development mode with hot-reloading:

```sh
npm run dev
```

The application will be available at `http://localhost:8081`.

### Production Build

To compile and minify the application for production:

```sh
npm run build
```

The output files will be generated in the `dist/` directory.

### Preview Production Build

To serve the production build locally for previewing:

```sh
npm run preview
```

### Linting

To lint the codebase and fix automatically correctable issues:

```sh
npm run lint
```