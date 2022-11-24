import React, { useRef, useState } from "react";

import { motion, useInView } from "framer-motion";

import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

type PageStateType = number;
const states: PageStateType[] = [0, 1, 2, 3, 4];

const parent = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.4,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const child = {
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
  hidden: {
    opacity: 0,
    y: -50,
  },
};

const dots = {
  visible: {
    opacity: 1,
    transition: {
      // delay: 2,
      staggerChildren: 0.25,
    },
  },
  hidden: {
    opacity: 0,
  },
};

const dot = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
  hidden: {
    opacity: 0,
    y: -30,
  },
};

const Introduction = () => {
  const [state, setState] = useState<PageStateType>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const progressState = () => {
    setState((state) => Math.min(Math.max(...states), state + 1));
  };

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-24">
      <div className="container mx-auto flex max-w-4xl flex-1 flex-col justify-center gap-10 text-lg">
        {state === 0 && (
          <>
            <p>Interactive web applications need four main components:</p>
            <ol className="mt-4 ml-8 flex list-inside list-decimal flex-col gap-2">
              <li>
                <strong>Data:</strong> CSV files, databases, APIs, or Excel
                Workbooks
              </li>
              <li>
                <strong>Data processing tool:</strong> I have used <em>R</em>,
                but of course this could be whatever you are comfortable with.
              </li>
              <li>
                <strong>Javascript:</strong> I've used <em>ReactJS</em> in these
                examples because it is what I am familiar with, but you could
                easily use <em>VueJS</em>, <em>Angular</em>, or <em>Svelte</em>{" "}
                if you prefer!
              </li>
              <li>
                <strong>Users:</strong> the target of our application.
              </li>
            </ol>
          </>
        )}
        {state === 1 && (
          <>
            <p>
              In what we will call the <strong>back-end</strong>, the
              statistician/data scientist uses <em>R</em> to process the data
              and generate graphics, statistics, or some other results.
            </p>
          </>
        )}
        {state === 2 && (
          <>
            <p>
              The <strong>front-end</strong> consists of the users' interactions
              with the app interface (here, ReactJS). This includes web pages,
              interactive graphics, links, and so on.
            </p>
            <p>
              These two separate parts of the application (front and back ends)
              are, on their own, well-developed pieces of infrastructure.
              However, how they communicate with each other is where we start to
              run into issues.
            </p>
          </>
        )}
        {state === 3 && (
          <>
            <p>
              A very common way to link the front and back ends is to simply
              pass data from <em>R</em> to <em>Javascript</em> in a one-way
              workflow.
            </p>
            <p>
              For example, data can be exported to a JSON file and read by
              Javascript, then used to make interactive graphics, tables, or
              whatever the developer thinks users want to see!
            </p>
            <p>
              Another option is, as I have done with the IDI Search App, to
              store the data in a central database that the web application can
              access and display information from.
            </p>
            <p>
              However, this one-way set-up is limiting. Users can only see
              information the statistician has already created and exported into
              the app. There's no way for the user to interact with <em>R</em>{" "}
              and their data (not even indirectly)!
            </p>
          </>
        )}
        {state === 4 && (
          <>
            <p>
              A better (at least theoretically) workflow is to have a two-way
              communication between <em>R</em> and <em>Javascript</em>. This is
              possible using the <strong>Rserve</strong> package, but does
              require a bit more effort to set up.
            </p>
            <p>
              The Disclosure Risk Calculator makes use of this, and not only
              allows users to interact directly with R, but also to upload their
              own data.
            </p>
            <p>"But what about Shiny", you say?</p>
            <p>
              Shiny is great for small dashboards, applications, and examples.
              It is not great, however, for embedding data-driven components in
              a web application (i.e., you can't do this). You also have very
              little control over the way things look, and if you want to add
              fancy Javascript animations, you can probably forget about it
              (unless you're a highly-proficient R and JS coder ...).
            </p>
          </>
        )}
        <div className="flex justify-between">
          <div
            className="flex cursor-pointer items-center text-slate-700 hover:text-slate-900"
            onClick={() => setState((state) => Math.max(0, state - 1))}
          >
            <ChevronLeftIcon height={24} />
            Back
          </div>
          <div
            className="flex cursor-pointer items-center text-slate-700 hover:text-slate-900"
            onClick={progressState}
          >
            Next <ChevronRightIcon height={24} />
          </div>
        </div>
      </div>

      <motion.div
        variants={parent}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative mx-auto flex items-center justify-center gap-8"
        onClick={progressState}
      >
        <motion.div variants={child}>
          <TableCellsIcon height={180} />
        </motion.div>
        <div className={`${state == 0 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>
        <motion.div variants={child} className={`transition-opacity`}>
          <img src="/Rlogo.svg" alt="R Logo" height={180} width={180} />
        </motion.div>
        <div className={`${state <= 2 && "opacity-0"} transition-opacity`}>
          {state < 4 ? (
            <ArrowRightIcon height={60} />
          ) : (
            <ArrowsRightLeftIcon height={60} />
          )}
        </div>
        <motion.div variants={child} className={`transition-opacity`}>
          <img
            src="/ReactLogo.svg"
            alt="ReactJS Logo"
            height={180}
            width={180}
          />
        </motion.div>
        <div className={`${state <= 1 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>
        <motion.div variants={child}>
          <UsersIcon height={180} />
        </motion.div>
      </motion.div>
      <div>
        <motion.div
          variants={dots}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center gap-4"
        >
          {states.map((x) => (
            <motion.div
              variants={dot}
              key={`state-` + x}
              onClick={(e) => setState(x)}
              className={`h-4 w-4 cursor-pointer rounded-full border-4 border-blue-300 ${
                state === x && "bg-blue-300"
              }`}
            ></motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Introduction;
