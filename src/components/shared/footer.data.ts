import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export const FOOTER_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/m7mdtam",
    icon: faGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohammed-tamimi-b252b0321/",
    icon: faLinkedin,
  },
  {
    label: "Portfolio",
    href: "https://mohammed-tamimi.vercel.app/",
    icon: faGlobe,
  },
] as const;

export const FOOTER_AUTHOR = "Mohammed Tamimi";
