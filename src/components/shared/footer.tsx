import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FOOTER_AUTHOR, FOOTER_LINKS } from "./footer.data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full flex justify-center px-3 pb-6 pt-4">
      <div className="w-[90vw] sm:w-[85vw] md:w-1/2 px-5 py-3.5 rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-3xl shadow-xl shadow-primary/5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-text-secondary text-xs sm:text-sm select-none">
          © {year}{" "}
          <span className="text-text font-medium">{FOOTER_AUTHOR}</span>. All
          rights reserved.
        </p>

        <div className="flex items-center gap-1">
          {FOOTER_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              aria-label={label}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-light/40 transition-all duration-200"
            >
              <FontAwesomeIcon icon={icon} className="w-4.5 h-4.5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
