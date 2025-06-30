# Movie Watchlist 🎬

**Live Demo:** https://www.kylejackson.dev/movie/

**Project Board:** https://github.com/users/kylewjackson/projects/9

## Overview

Movie Watchlist is a React + TypeScript web application that lets you search for movies and maintain a personal watchlist. It integrates with the **The Movie Database (TMDB) API** to fetch real-time movie data (titles, posters, details)[[tmdb.ts](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/api/tmdb.ts)], demonstrating how to consume external APIs in a React app. The project emphasizes modern front-end practices — it is built with functional React components and hooks, uses **React Router** for multi-page routing, and is styled with **Bootstrap 5** (via React-Bootstrap) for a responsive, mobile-friendly UI [[MovieCard.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/MovieCard.tsx)]. Strong **TypeScript** typing is used throughout to ensure reliability and clarity of the codebase [[movie.ts](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/types/movie.ts)]. This README provides an in-depth look at the app’s features, technology stack, and setup instructions.

## Features 🚀

- **🔍 Movie Search:** Users can search for movies by title through an input bar. Upon submission, the app calls the TMDB API to retrieve matching movies [[tmdb.ts](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/api/tmdb.ts)]. Results are displayed as a list of movie cards showing each film’s poster, title, release year, and average rating. To improve relevance, results are sorted by popularity before display. The UI provides feedback for the number of results found and gracefully handles no matches – e.g. “No results found” is shown if a query returns nothing [[SearchResults.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/SearchResults.tsx)]. A loading indicator and error messages are also shown when appropriate to let the user know if data is loading or if something went wrong.

- **🎞️ Detailed Movie Info:** Clicking on a movie takes you to a dedicated detail page for that film. This page (routed via React Router) fetches additional details from TMDB (like full plot synopsis, runtime, budget, revenue, and status) and displays them in a rich layout [[MovieDetails.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/MovieDetails.tsx)]. The movie’s title is shown with its release year, and a high-resolution backdrop image is used as a banner for visual impact. Genre badges are listed for quick glance of the movie’s categories, and other metadata like original language, release date, and user rating are presented in an organized manner. The detail view also provides convenient external links – for example, buttons to view the movie’s page on IMDb or Letterboxd open in a new tab. A “Go Back” button allows returning to the previous page or search results easily, enhancing navigation.

- **⭐ Watchlist (Favorites):** Users can curate a personal watchlist of movies they’re interested in. Every movie card includes an **Add to Watchlist** / **Remove from Watchlist** toggle button [[WatchlistButton.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/WatchlistButton.tsx)]. With one click, a movie is added to the watchlist (or removed if it was already saved). The current watchlist count is reflected in the navigation bar for quick reference [[App.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/App.tsx)]. The watchlist is accessible on its own page (via the “Watchlist” route) where all saved movies are listed. This page uses the same card layout to display each saved movie, and supports pagination – if the list is long, it’s divided into pages of 20 items for manageable viewing [[WatchlistView.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/views/WatchlistView.tsx)]. Users can navigate pages with pagination controls at the bottom. The watchlist is persisted using **localStorage**, so your saved movies remain intact across page reloads or browser restarts. There’s also a **Clear Watchlist** feature to empty the list in one go; clicking “Clear Watchlist” opens a confirmation modal to prevent accidental deletion [[ClearWatchlist.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/ClearWatchlist.tsx)].

- **🔄 Real-Time Data Refresh:** To ensure the watchlist data stays up-to-date, the app implements a smart background refresh system. Each saved movie item stores a timestamp of when it was last updated. On loading the Watchlist page, a custom hook checks each movie to see if its data is “stale” (older than 24 hours) [[useWatchlistRefresh.ts](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/hooks/useWatchlistRefresh.ts)]. If so, the app automatically fetches the latest details for that movie from the API in the background. Only fields that have changed are updated, and a new timestamp is saved. This happens seamlessly and ensures that even if you saved a movie days ago, you’ll see current information (such as an updated poster or new ratings) without having to manually refresh. This strategy avoids unnecessary API calls – it skips refreshing items that were recently checked or updated, balancing freshness of data with performance. (Future enhancements could include a manual “refresh” button and session-based refresh limits to refine this feature.)

- **💅 Responsive UI and Theming:** The app’s interface is built to be fully responsive and work well on phones, tablets, and desktops. It uses the Bootstrap grid system and components (via React-Bootstrap) for layout, so content automatically reflows into a mobile-friendly format on smaller screens [[MovieCard.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/MovieCard.tsx)]. Styling is consistent and modern, leveraging Bootstrap’s utility classes (for spacing, flexbox, etc.) and a custom SCSS theme. Additionally, a **theme switcher** is provided to toggle between **Light mode** and **Dark mode**. Users can select light, dark, or “system default” theme from a drop-down toggle in the navigation bar [[ThemeSwitch.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/ThemeSwitch.tsx)]. The app uses Bootstrap v5.3’s built-in color mode support – it dynamically sets a `data-bs-theme` attribute on the document `<html>` element to switch the global theme. All components instantly adjust styling based on this (for example, backgrounds and text switch to dark mode). The theme preference is also saved to localStorage so that your chosen mode persists on return visits.

- **♿ Accessibility:** _Movie Watchlist_ was developed with attention to accessibility. Semantic HTML elements and ARIA attributes are used throughout. For example, important status changes (like search results loading or errors) are announced to assistive technologies via an invisible ARIA live region [[SearchView.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/views/SearchView.tsx)]. Many visual elements include screen-reader friendly labels or hidden headings – e.g. the genre badges and ratings have assistive text so that screen reader users can understand them, and modal dialogs include proper focus management and labels. The color scheme and typography also aim for sufficient contrast, aligned with Bootstrap’s default accessibility standards. Overall, the app strives to be usable by all users, complying with best practices where possible.

## Tech Stack 🛠️

- **React 18** – A JavaScript library for building user interfaces. This project uses modern React features like **functional components** and **hooks** (`useState`, `useEffect`, custom hooks) to manage state and side effects. React Router is used for declarative client-side routing between pages (Search, Watchlist, Details) [[main.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/main.tsx)], and context (via the Outlet context API) is used to share state across routes without prop drilling [[App.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/App.tsx)].

- **TypeScript** – All code is written in TypeScript, providing static type checking and improved developer experience. Custom interfaces/types define the shape of data (e.g. a `Movie` interface with fields like _id_, _title_, _year_, _genres_, etc.) [[movie.ts](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/types/movie.ts)] and help catch errors early. The use of TypeScript ensures that API responses are properly typed and that components receive the correct props. Even complex structures like combined types for full movie details are defined (see `FullMovie` which extends base Movie with additional fields). This leads to more robust and self-documenting code.

- **Vite** – A fast build tool and development server. The project was initialized with Vite (for React + TypeScript), which provides instant hot-reloading during development and efficient bundling for production. Vite’s configuration handles the TypeScript compiler and SCSS processing. You can run the app locally with Vite’s dev server (`npm run dev`) and get a quick feedback loop during development.

- **Bootstrap 5 + React-Bootstrap** – The UI is built with Bootstrap 5 for layout and styling, and React-Bootstrap components for seamless integration in React. The app uses a custom Bootstrap SCSS build to enable dark mode and override certain defaults (e.g. disabling smooth scroll) [[bootstrap.scss](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/scss/bootstrap.scss)]. Layout is structured with the Bootstrap grid (rows and columns) for responsive design [[MovieCard.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/components/MovieCard.tsx)]. Prebuilt components like Navbar, Dropdowns, Modals, Alerts, Cards, and Buttons from React-Bootstrap are used for functionality and consistent styling. Theming is leveraged via Bootstrap variables and the new color mode support (triggered by `data-bs-theme`). The project also utilizes **Bootstrap Icons** (via CDN) for icons like search, bookmark, star ratings, etc., providing a visual language without extra image assets.

- **TMDB API** – Movie data is sourced from the TMDB API. The app communicates with TMDB’s REST endpoints using fetch calls. For example, searching movies calls the `/search/movie` endpoint with the query term, and retrieving details uses the `/movie/{id}` endpoint [[tmdb.ts](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/api/tmdb.ts)]. All requests include an API key (stored in an environment variable for security) and expect JSON responses. The app defines TypeScript types matching TMDB’s JSON structure (via a `tmdb.d.ts` or similar) to parse responses reliably. A small API utility module handles these calls and transforms the data into the app’s internal `Movie` format (e.g. constructing image URLs for posters/backdrops, formatting release year). **Note:** You will need your own TMDB API key to run the app locally (see **Getting Started** below). TMDB also provides the list of official genres, which the app fetches once and uses to map genre IDs to names [[Phase 4: X7](https://github.com/kylewjackson/web-dev-projects/issues/60)].

- **Local Storage & Custom Hooks** – The browser’s LocalStorage is used for persistent data storage on the client side. This project implements a custom React hook `useLocalStorage` that abstracts the logic of syncing state to LocalStorage [[App.tsx](https://github.com/kylewjackson/web-dev-projects/blob/b74734437974a90d4e6fac90846341a1bf7dd276/Movie-Project/src/App.tsx)]. It is used for the watchlist (so that saved movies persist) and for remembering the user’s theme preference. Another custom hook `useWatchlistRefresh` handles the background updating of watchlist movies as described earlier. These hooks demonstrate advanced React patterns and encapsulate reusable logic (for example, any component using `useLocalStorage` can easily persist its state by key).

- **Additional Libraries:** The app uses a few lightweight libraries to enhance functionality, including: **React Router** (for routing), **Sass** (for writing SCSS styles), **slugify** (to create URL-friendly slugs for movie titles in routes), and **ESLint** (for code linting, ensuring code quality). These tools collectively support a robust development workflow and clean codebase.

## Getting Started 💻

Follow these steps to run the Movie Watchlist app locally on your machine:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/kylewjackson/web-dev-projects.git
    ```

    _This repo may contain multiple projects; the Movie Watchlist source is in the `Movie-Project/` subdirectory._

2. **Install dependencies:**  
    Make sure you have Node.js and npm installed. Navigate to the project folder and run:

    ```bash
    cd web-dev-projects/Movie-Project
    npm install
    ```

    This will install React, React-Bootstrap, Vite, and all other dependencies listed in `package.json`.

3. **API Key setup:**  
    This app uses the TMDB API which **requires an API key**. Sign up for a free account at TMDB and obtain an API key from your account settings.  
    In the `Movie-Project` directory, create a file named **`.env`** (it's already in .gitignore to keep it private [[#37]](https://github.com/kylewjackson/web-dev-projects/issues/37)). Add the following line to the `.env` file:

    ```bash
    VITE_TMDB_API_KEY = YOUR_TMDB_API_KEY_HERE
    ```

    Replace `YOUR_TMDB_API_KEY_HERE` with the key you got from TMDB. The app is configured to read this environment variable at build time (via Vite) and include it in API requests.

4. **Run the development server:**  
    Start the app in development mode with:

    ```bash
    npm run dev
    ```

    This will launch the Vite dev server (by default on port 5173). The console will output the local URL (something like `http://localhost:5173`) – open that address in your browser. You should see the application’s home page load. Vite provides hot-module reloading, so any code changes you make will refresh the app in real-time.

5. **Use the app:**  
    Once running, you can try out the features:

    - Enter a movie name in the search bar and press "Search" to fetch results.
    - Click "Full Details" on any movie to navigate to its detail page.
    - Click the **Add to Watchlist** button on a movie to save it. Navigate to the "Watchlist" page via the navbar to see your saved movies.
    - Toggle the theme using the button on the top-right (sun/moon icon) to switch between light and dark mode.
    - Try clearing the watchlist by clicking "Clear Watchlist" (if you have items saved).  
      During development, the console and overlay will show any errors or warnings from React/Vite if something goes wrong.

6. **Build for production (optional):**  
    To create an optimized production build, run:

    ```bash
    npm run build
    ```

    This will compile the app into static files in the `dist/` folder. You can then run `npm run preview` to preview the production build locally. Deploy the contents of `dist/` to your hosting of choice to serve the app (for example, the live demo is deployed on a personal domain).

## Future Improvements 🌟

This project (**Movie Watchlist v1.0**) covers the core functionality, but there are ideas on the roadmap to make it even better:

- **Session Caching for Refresh:** Implement a session-based flag so that the watchlist auto-refresh runs at most once per session. This would prevent redundant API calls if you navigate away and back to the watchlist in a single session.
- **Manual Refresh Control:** Add a user-facing button to manually refresh the watchlist data on demand. This could be accompanied by a loading spinner or toast notification to inform when new data has been fetched.
- **Enhanced Search (Filters & Suggestions):** Extend the search functionality with filters (e.g. by year, genre, or rating) to narrow down results. Also consider adding typeahead suggestions as the user types, for a more dynamic search experience.
- **Global State Management:** Currently the app passes state via React Router context. As the app grows, moving to a more scalable state management (like React Context API or Redux) could help. For example, sharing the genre map or theme across components without prop drilling could be cleaner with context.
- **Additional Info & Polish:** Display additional useful info such as cast and crew on the movie detail page (TMDB API provides this). Implement subtle animations or transitions (for modals, page changes, etc.) to enhance UX. Continue refining accessibility by user testing (e.g. ensure screen reader navigation is intuitive, and keyboard-only usage is smooth for all features).

## Acknowledgments 🙏

Data for this project is provided by the TMDB API. **This product uses the TMDB API but is not endorsed or certified by TMDB.** The Bootstrap icons are from the open-source **Bootstrap Icons** library. The project structure and development plan were influenced by a self-defined roadmap, breaking the work into phases (UI, API integration, watchlist, routing) which helped in systematically building and documenting the app [[Phase 1](https://github.com/kylewjackson/web-dev-projects/issues/30)] [[Phase 4](https://github.com/kylewjackson/web-dev-projects/issues/53)]. Finally, thank you to the open-source community for the tools that made this project possible.

Feel free to explore the code and suggest improvements. Enjoy the app! 🎉
