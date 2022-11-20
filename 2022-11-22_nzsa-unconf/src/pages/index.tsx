import { type NextPage } from "next";
import Head from "next/head";
import { motion, useMotionValue, useScroll } from "framer-motion";
import TitleSlide from "../slides/00_title";
import { useEffect, useRef, useState } from "react";
import ReactJSLogo from "../components/logos/ReactJSLogo";
import RLogo from "../components/logos/RLogo";
import Introduction from "../slides/01_introduction";
import IDISearchApp from "../slides/02_idisearchapp";
import IDISearchAppDemo from "../slides/02_idisearchapp_demo";
import DisclosureApp from "../slides/03_disclosureapp";
import DisclosureAppDemo from "../slides/03_disclosureapp_demo";
import EndSlide from "../slides/09_end";

const TALK_LENGTH_MINUTES = 15;
const progress = {
  initial: {
    scaleX: 0,
  },
  final: {
    scaleX: 1,
    transition: { duration: TALK_LENGTH_MINUTES * 60, ease: "linear" },
  },
};

const Home: NextPage = () => {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  return (
    <>
      <Head>
        <title>NZSA UnConference 2022 | Tom Elliott</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        ref={ref}
        className="relative h-screen w-screen snap-y snap-mandatory overflow-x-hidden bg-gradient-to-br from-stone-100 to-stone-200"
      >
        <motion.div
          variants={progress}
          initial="initial"
          animate={started ? "final" : "initial"}
          className="fixed z-10 h-[2px] w-full origin-left bg-blue-400"
        />

        <Slide
          title={
            <div className="drop-shadow-lg" onClick={() => setStarted(true)}>
              Introducing <em>IDI Search</em> and{" "}
              <em>Disclosure Risk Calculator</em>
            </div>
          }
          subtitle={
            <div className="drop-shadow">
              Two <ReactJSLogo />
              <strong>ReactJS</strong> web apps powered by <RLogo />
            </div>
          }
          style="main"
        >
          <TitleSlide />
        </Slide>

        <Slide title={"Introduction"}>
          <Introduction />
        </Slide>

        <Slide title={"IDI Search App"}>
          <IDISearchAppDemo />
        </Slide>

        <Slide title={"IDI Search App"}>
          <IDISearchApp />
        </Slide>

        <Slide title={"Disclosure Risk Calculator"}>
          <DisclosureAppDemo />
        </Slide>

        <Slide title={"Disclosure Risk Calculator"}>
          <DisclosureApp />
        </Slide>

        <Slide title="" style="main">
          <EndSlide />
        </Slide>
      </main>
    </>
  );
};

export default Home;

interface SlideProps {
  children: JSX.Element | JSX.Element[];
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  style?: "standard" | "main";
}

const Slide = ({
  children,
  title,
  subtitle = "",
  style = "standard",
}: SlideProps) => {
  return (
    <section className="mx-auto flex h-screen w-full snap-start flex-col justify-center gap-4 p-8">
      <hgroup className="mx-auto flex w-full flex-col items-center gap-y-4 text-center">
        <h1 className={`text-3xl ${style === "standard" && "uppercase"}`}>
          {title}
        </h1>
        {subtitle && (
          <h2 className="text-2xl italic text-neutral-800">{subtitle}</h2>
        )}
      </hgroup>

      {style === "main" && (
        <div className="container mx-auto mt-24">{children}</div>
      )}
      {style === "standard" && <div className="flex-1">{children}</div>}
    </section>
  );
};
