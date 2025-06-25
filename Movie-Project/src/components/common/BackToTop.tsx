import { useState, useRef, useEffect } from "react";
import scrollTop from "../../utils/scrollTop";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  const prevY = useRef(0);
  const fadeTimer = useRef<number | undefined>(undefined);
  const hideTimer = useRef<number | undefined>(undefined);

  const SCROLL_THRESHOLD = 300;
  const VISIBLE_DURATION = 3000;
  const FADE_DURATION = 500;

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;

      if (y > SCROLL_THRESHOLD && y > prevY.current) {
        setVisible(true);
        setFading(false);

        window.clearTimeout(fadeTimer.current);
        window.clearTimeout(hideTimer.current);

        fadeTimer.current = window.setTimeout(() => {
          setFading(true);

          hideTimer.current = window.setTimeout(() => {
            setVisible(false);
            setFading(false);
          }, FADE_DURATION);
        }, VISIBLE_DURATION);
      } else if (y < SCROLL_THRESHOLD) {
        setVisible(false);
        setFading(false);
        window.clearTimeout(fadeTimer.current);
        window.clearTimeout(hideTimer.current);
      }

      prevY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fadeTimer.current);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={scrollTop}
      className={`position-fixed bottom-0 end-0 p-0 pe-2 border-0 bg-transparent text-reset back-to-top-btn${
        fading ? " fade-out" : ""
      }`}
    >
      <i className="bi bi-arrow-up-circle-fill fs-1" aria-label="Back to Top" />
    </button>
  );
}
