import { BsGithub } from "react-icons/bs";
import UniversityLogo from "../assets/univeristy-of-kentucky-logo.svg";
import { MdOpenInNew } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <img
          className="mb-4 h-auto w-56 max-w-full sm:mb-6 sm:w-72"
          src={UniversityLogo}
          alt="University of Kentucky Logo"
        />

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm leading-relaxed sm:text-base">
            Made with 💙 by{" "}
            <a
              className="underline"
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/apaolaoliveira"
            >
              Paola Oliveira
            </a>{" "}
            :)
          </p>

          <button
            onClick={() =>
              window.open(
                "https://github.com/WildcatJourneyUK/wildcat-journey-prototype",
                "_blank"
              )
            }
            className="flex max-w-full items-center justify-center gap-2 rounded-lg bg-lightBlue px-4 py-3 text-sm text-primary sm:text-base"
          >
            <BsGithub size={24} className="shrink-0" />
            <span className="break-words text-center">View on GitHub</span>
            <MdOpenInNew size={18} className="shrink-0" />
          </button>

          <p className="text-sm sm:text-base">&copy; Wildcat Journey</p>

          <p className="max-w-md text-sm leading-relaxed sm:text-base">
            Independent prototype project. All content is illustrative.
          </p>

          <p className="max-w-md text-sm leading-relaxed sm:text-base">
            Not affiliated with or endorsed by the University of Kentucky.
          </p>
        </div>
      </div>
    </footer>
  );
}