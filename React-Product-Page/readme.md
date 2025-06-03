# React Product Page Demo

*June 2, 2025*

I wanted to do some general styling refinements that got missed the first time around to clean things up a bit before starting Version 2. Ended up doing a bit of a large refactor, converting component strucutre and adding scss as well. This is the final version of V1.

*October 1, 2019*

Bug: There's a warning in the Chrome dev console about createClass being deprecated, which seems to be an issues with create-react-app, and I'm currently looking into it. It shouldn't be causing any issues within the app.

Version 1.1 beta

*September 30, 2019*

This product page demo was made with React.JS. As of now the project is solely Front End, so any registration/login functionality is for demo purposes only.

Readable [demo code](https://github.com/kylewjackson/web-dev-projects/tree/master/React-Product-Page/demo-code/demo.js) can be found in this repo as a [subfolder](https://github.com/kylewjackson/web-dev-projects/tree/master/React-Product-Page/demo-code). [Live Preview](https://www.kylejackson.dev/react-product-page/).

## Features

* Custom SVG icons
* Modal alerts/prompts
  * Accessible tabbing
  * Close on ESC or clicking outside of popup
* Nav Category Dropdown
* Login/Sign Up Demo
  * User types in name to test
  * Alerts user to registered status
  * Guest cart is consolidated upon login, and saved on logout
* Dynamic Cart
  * Dynamic thumbnails based on option selection
  * Remove items
  * Cart status displayed in icon
* Product thumbnails
  * Buttons used to cycle through product images
  * Modal popup enlarges the currently displayed image
* Products have unique options and quantities
  * If max quantity is reached, add to cart is disabled
  * If quantity is exceeded on add or option change, user is alerted and quantity is maxed out in cart
* Star Rating system
  * Shows dynamic user averge and personal rating
* Product Reviews
  * Sort by helpful, recent, old, and star rating
  * Reviews have feedback buttons, dynamically marked to indicate rating distribution, and whether or not the user has rated the review
* Write a Review
  * When user is logged in, their review is always shown at the bottom
  * Review can be edited, with feedback reset on a change, but not if cancelled first.
  * Rating of product may be changed without affecting previous review.

## Future Updates

* Increased accessibility in modal, namely the focused element upon closing
* Greater cross-browser consistency, namely Firefox layout tweaks
* Refactor/rewrite HTML, and create favicon
* Currency conversion

## Version History

Version 1.1

*June 2, 2025*

### 1. Component Modularization & Migration to `.jsx`

- Migrated the main app entry point from `App.js` to `App.jsx`.
- Decomposed core UI into modular React components:
  - **New components added**: `Cart`, `Header`, `Footer`, `Main`, `Modal`, `Navbar`, `LogIn`, `Product`, `Rating`, `Review`, `Thumbnails`, and relevant subcomponents.
  - Icons moved and renamed to `Icons.jsx`.
- Codebase is now more **organized, maintainable, and component-driven**.

---

### 2. SCSS Refactor & Theming

- Introduced SCSS styles under `src/scss/`:
  - Global styles are defined in `global.scss`, importing partials for: `base`, `navbar`, `cart`, `modal`, `login`, `product`, `stars`, `images`, `reviews`, and `footer`.
  - Each UI section has a **dedicated SCSS partial** for better maintainability.
- `App.css` has been rewritten for:
  - Improved layout using **CSS Grid** and **Flexbox**.
  - Enhanced **responsive design** (notably for cart and product views).
  - **Animated flyout menus** using `react-transition-group`.
  - General **UI polish** including controls, modals, and transitions.

---

### 3. Dependency Updates

- **New dependencies**:
  - `react-transition-group` for UI animations.
  - `sass` and `scss` for SCSS support.
- **Dev dependencies**:
  - `eslint` and related plugins for React and accessibility linting.

---

### 4. Feature Enhancements

- **Cart & Flyout Menus**:
  - Cart is now **animated and fully responsive**.
  - Category and cart flyouts use **smooth animated transitions**.
- **Product, Reviews & Ratings**:
  - Modularized product forms and options.
  - Refactored review system with improved UI for writing and viewing reviews.
  - Enhanced ratings logic for average and user-specific ratings.
- **Login/Signup**:
  - Separate, accessible forms for **login and signup**.
  - Includes basic **error handling**.

---

### 5. Accessibility & Code Quality

- Improved **keyboard navigation** (tab index management with open modals).
- **Semantic markup** and use of **ARIA attributes**.
- ESLint enforces best practices across the codebase.

---

### 6. General UI/UX Improvements

- Responsive layouts for all content and navigation.
- Improved modal behavior:
  - Focus management
  - Escape key support
  - Click outside to close
- Enhanced styles for product pages, reviews, cart, and overall flow.

---

### ✅ Summary

This refactor:
- Modularizes the codebase
- Upgrades styling to a scalable SCSS system
- Introduces smooth animated transitions
- Modernizes the cart and review systems
- Significantly improves **accessibility, maintainability, and user experience** across the React Product Page application.

Version 1.0 beta

*September 26, 2019*

This product page demo was made with React.JS, and is fully funtional, but not currently styled. A [Figma mockup](https://www.figma.com/file/fv202Jfted2mYOvnBm0hfZ/Shopping-Demo?node-id=0%3A1) can be found for a preview of what the final product will look like on completion. As of now the project is solely Front End, so any registration/login functionality is for demo purposes only.

Readable [demo code](https://github.com/kylewjackson/web-dev-projects/tree/master/React-Product-Page/demo-code/demo.js) can be found in this repo as a [subfolder](https://github.com/kylewjackson/web-dev-projects/tree/master/React-Product-Page/demo-code). Bare-bones [live preview](https://www.kylejackson.dev/react-product-page/).
