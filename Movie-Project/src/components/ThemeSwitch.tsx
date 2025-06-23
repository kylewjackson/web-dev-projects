import type { Theme } from "../types/preferences";

type Props = {
	userTheme: Theme;
  activeTheme: Theme;
  setUserTheme: (theme: Theme) => void;
};

export default function ThemeSwitch({
	userTheme,
  activeTheme,
  setUserTheme,
}: Props) {
  return (
    <div className="dropdown">
      <button
        className={`btn ${activeTheme === "dark" ? 'btn-dark' : 'btn-light'} dropdown-toggle`}
        type="button"
        id="themeDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
				aria-label="Select theme"
      >
        {userTheme === "auto" ? (
          <i className="bi bi-shadows me-1" aria-label="auto mode" />
        ) : userTheme === "dark" ? (
          <i className="bi bi-moon-stars me-1" aria-label="dark mode" />
        ) : (
          <i className="bi bi-brightness-high me-1" aria-label="light mode" />
        )}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="themeDropdown"
      >
        <li>
          <button
            className="dropdown-item d-flex align-items-center"
            data-bs-theme-value="light"
						onClick={() => setUserTheme("light")}
          >
            <i className="bi bi-brightness-high me-1" />
            Light
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center"
            data-bs-theme-value="dark"
						onClick={() => setUserTheme("dark")}
          >
            <i className="bi bi-moon-stars me-1" />
            Dark
          </button>
        </li>
        <li>
          <button
            className="dropdown-item d-flex align-items-center"
            data-bs-theme-value="auto"
						onClick={() => setUserTheme("auto")}
          >
            <i className="bi bi-shadows me-1" />
            System
          </button>
        </li>
      </ul>
    </div>
  );
}
