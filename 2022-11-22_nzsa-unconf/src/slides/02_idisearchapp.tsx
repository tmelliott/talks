import React, { useRef, useState } from "react";

import { motion, useInView } from "framer-motion";

import {
  ArchiveBoxIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

type PageStateType = number;
const states: PageStateType[] = [0, 1, 2, 3];

const parent = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 1,
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
    x: 0,
    transition: {
      duration: 1,
    },
  },
  hidden: {
    opacity: 0,
    x: -50,
  },
};

const IDISearchApp = () => {
  const [state, setState] = useState<PageStateType>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const progressState = () => {
    setState((state) => Math.min(Math.max(...states), state + 1));
  };

  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-24">
      <div
        className="container relative mx-auto flex items-center justify-center gap-8"
        onClick={progressState}
      >
        {/* DATA BOXES SPINNING! */}
        <motion.div
          variants={parent}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`${
            state > 0 ? "animate-spin-slow" : ""
          } mr-16 flex flex-col gap-14 transition-opacity`}
        >
          <motion.div className="relative" variants={child}>
            <TableCellsIcon
              height={120}
              className={`${state > 0 ? "animate-spin-slow-reverse" : ""}`}
            />
            {state === 0 && (
              <p className="absolute left-full top-1/2 translate-x-6 -translate-y-1/2 whitespace-nowrap text-xl">
                Lists of database variables
              </p>
            )}
          </motion.div>
          <motion.div className="relative" variants={child}>
            <ArchiveBoxIcon
              height={120}
              className={`${state > 0 ? "animate-spin-slow-reverse" : ""}`}
            />
            {state === 0 && (
              <p className="absolute left-full top-1/2 translate-x-6 -translate-y-1/2 whitespace-nowrap text-xl">
                Data Dictionaries
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* ARROW FROM DATA TO R */}
        <div className={`${state < 1 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>

        {/* R LOGO */}
        <div className={`${state < 1 && "opacity-0"} transition-opacity`}>
          <img src="/Rlogo.svg" alt="R Logo" height={180} width={180} />
        </div>

        {/* ARROW FROM R TO DATABASE */}
        <div className={`${state < 2 && "opacity-0"} transition-opacity`}>
          <ArrowRightIcon height={60} />
        </div>

        {/* DATABASE ICON */}
        <div className={`${state < 2 && "opacity-0"} transition-opacity`}>
          <CircleStackIcon height={180} />
        </div>

        {/* ARROW FROM DATABASE TO REACT */}
        <div className={`${state < 3 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>

        {/* REACT LOGO */}
        <div className={`${state < 3 && "opacity-0"} transition-opacity`}>
          <img
            src="/ReactLogo.svg"
            alt="ReactJS Logo"
            height={180}
            width={180}
          />
        </div>

        {/* ARROW FROM REACT TO USERS */}
        <div className={`${state < 3 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>

        {/* USERS ICON */}
        <div className={`${state < 3 && "opacity-0"} transition-opacity`}>
          <UsersIcon height={180} />
        </div>
      </div>
      <div>
        <div className="flex justify-center gap-4">
          {states.map((x) => (
            <div
              key={`state-` + x}
              onClick={(e) => setState(x)}
              className={`h-4 w-4 cursor-pointer rounded-full border-4 border-blue-300 ${
                state === x && "bg-blue-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IDISearchApp;
