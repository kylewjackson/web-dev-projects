import { Dropdown } from "react-bootstrap";
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
  // pick the right icon for the toggle
  const icon =
    userTheme === "auto" ? (
      <i className="bi bi-shadows me-1" aria-label="System theme" />
    ) : userTheme === "dark" ? (
      <i className="bi bi-moon-stars me-1" aria-label="Dark mode" />
    ) : (
      <i className="bi bi-brightness-high me-1" aria-label="Light mode" />
    );

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        id="themeDropdown"
        variant={activeTheme === "dark" ? "dark" : "light"}
        aria-label="Select theme"
      >
        {icon}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          active={userTheme === "light"}
          className="d-flex align-items-center"
          onClick={() => setUserTheme("light")}
        >
          <i className="bi bi-brightness-high me-1" />
          Light
        </Dropdown.Item>
        <Dropdown.Item
          active={userTheme === "dark"}
          className="d-flex align-items-center"
          onClick={() => setUserTheme("dark")}
        >
          <i className="bi bi-moon-stars me-1" />
          Dark
        </Dropdown.Item>
        <Dropdown.Item
          active={userTheme === "auto"}
          className="d-flex align-items-center"
          onClick={() => setUserTheme("auto")}
        >
          <i className="bi bi-shadows me-1" />
          System
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
