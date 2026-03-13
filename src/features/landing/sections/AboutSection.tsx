import { useNavigate } from "react-router-dom";
import { BsGithub, BsLinkedin } from "react-icons/bs";

import wjTinyLogo from "../../../../public/wj-tiny-logo.png";
import { BiArrowFromLeft } from "react-icons/bi";
import { Fade } from 'react-awesome-reveal';

export default function AboutSection() {
  const nav = useNavigate();

  return (
    <section className="border-t border-black/10 bg-white">
      <Fade direction="up" triggerOnce delay={150}  className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-16 sm:py-20 lg:px-8">
        <div className="group w-full max-w-5xl rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:rotate-[0.2deg] hover:shadow-[0_20px_60px_rgba(0,51,160,0.12)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.38fr_0.62fr]">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-[28px] bg-primary/10 blur-2xl transition duration-300 group-hover:bg-primary/15" />
                <img
                  src="https://github.com/apaolaoliveira.png"
                  alt="Paola Oliveira"
                  className="relative h-64 w-64 rounded-[28px] object-cover border border-black/10 shadow-sm sm:h-72 sm:w-72"
                />
              </div>
            </div>

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary border border-secondary/10 text-white px-3 py-1 text-sm text-primary">
                <img src={wjTinyLogo} alt="" className="h-4 w-4" aria-hidden="true" />
                <span>Meet the builder</span>
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                Hey there! I’m Paola Oliveira.
              </h2>

              <div className="mt-5 space-y-4 text-base leading-7 text-black">
                <p>
                  Wildcat Journey was inspired by a simple thought: the kind of guidance I once wished I had while navigating the U.S. 
                  application process as an international student. Guidance that brings clarity, confidence, and less guesswork.
                </p>

                <p>
                  I'm passionate about building technology that serves people and change realities. This prototype reflects my perspective as a prospective student and my 
                  motivation to actively contribute to the Ambassador Program by exploring better systems for student support and outreach.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <a
                    href="https://www.linkedin.com/in/apaolaoliveira"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-primary transition hover:bg-[#f7f9fd]"
                  >
                    <BsLinkedin className="text-base" />
                    LinkedIn
                  </a>

                  <a
                    href="https://github.com/apaolaoliveira"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-primary transition hover:bg-[#f7f9fd]"
                  >
                    <BsGithub className="text-base" />
                    GitHub
                  </a>
                </div>

                <button
                  onClick={() => nav("/auth")}
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                  Explore the prototype
                  <BiArrowFromLeft size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </section>
  );
}