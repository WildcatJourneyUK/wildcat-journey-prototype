import { useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import wjTinyLogo from "../../../../public/wj-tiny-logo.png";
import { BsGithub } from "react-icons/bs";
import { BiArrowFromLeft } from "react-icons/bi";

export default function HeroSection() {
  const nav = useNavigate();

  return (
    <section className="relative isolate min-h-[calc(100vh-88px)] overflow-hidden text-white">
      <div
        className="absolute inset-0 -z-20 bg-[url('/flags-background.png')] bg-cover bg-center"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0033A0]/85 via-[#0033A0]/65 to-[#0033A0]/35"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="max-w-full">
          <Fade direction="down" triggerOnce>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <img
                src={wjTinyLogo}
                alt=""
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span>Prototype for the International Ambassador Program</span>
            </div>
          </Fade>

          <Fade direction="down" triggerOnce delay={100}>
            <h1 className="max-w-6xl text-xl font-semibold tracking-tight sm:text-3xl  lg:text-5xl">
              Helping prospective international Wildcats navigate their journey to the University of Kentucky.
            </h1>
          </Fade>

          <Fade triggerOnce delay={150}>
            <p className="mt-6 max-w-6xl text-base text-white/85 sm:text-lg">
              A gamified platform that transforms the UK application and transition process into a fun and engaging experience.
              With personalized quests, mentorship and opportunities matching, and a supportive community, WJ makes
              the University of Kentucky feels like home from the very start.
            </p>
          </Fade>

          <Fade triggerOnce delay={200}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                onClick={() => nav("/auth")}
                className="group inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-white px-7 py-3.5 text-base font-semibold text-primary shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
              >
                Explore the prototype
                <BiArrowFromLeft size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="https://github.com/WildcatJourneyUK/wildcat-journey-prototype"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-base font-medium text-white backdrop-blur-md transition duration-300 hover:bg-white/15"
              >
                <BsGithub size={20} className="mr-2" />
                View repository
              </a>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}