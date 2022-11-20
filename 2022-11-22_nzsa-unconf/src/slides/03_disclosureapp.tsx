import React, { useRef, useState } from "react";

import {
  ArchiveBoxIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { motion, useInView } from "framer-motion";

type PageStateType = number;
const states: PageStateType[] = [0, 1, 2, 3, 4, 5];

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

const DisclosureApp = () => {
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
        <div className={`${state <= 4 && "opacity-0"} transition-opacity`}>
          <motion.div layoutId={"usersData"} className="relative">
            <TableCellsIcon height={120} className={`${state > 0 ? "" : ""}`} />
          </motion.div>
        </div>

        {/* ARROW FROM DATA TO R */}
        <div className={`${state <= 4 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>

        {/* R LOGO */}
        <div
          className={`${state < 3 && "opacity-0"} relative transition-opacity`}
        >
          <img src="/Rlogo.svg" alt="R Logo" height={180} width={180} />
          {state === 4 && (
            <motion.div
              layoutId={"usersData"}
              className={`absolute -right-2 -top-10 transition-opacity`}
            >
              <TableCellsIcon height={80} color="green" />
            </motion.div>
          )}
        </div>

        {/* ARROW FROM R TO REACT */}
        <div className={`${state < 3 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>

        {/* REACT LOGO */}
        <div
          className={`${state < 1 && "opacity-0"} relative transition-opacity`}
        >
          <img
            src="/ReactLogo.svg"
            alt="ReactJS Logo"
            height={180}
            width={180}
          />
          {state >= 2 && state <= 3 && (
            <motion.div
              layoutId={"usersData"}
              className={`absolute -right-2 -top-10 transition-opacity`}
            >
              <TableCellsIcon height={80} color="green" />
            </motion.div>
          )}
        </div>

        {/* ARROW FROM REACT TO USERS */}
        <div className={`${state < 1 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>

        {/* USERS ICON */}
        <motion.div
          variants={parent}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`relative transition-opacity`}
        >
          <UsersIcon height={180} />
          {state <= 1 && (
            <motion.div
              layoutId={"usersData"}
              className={`absolute -right-2 -top-10 transition-opacity`}
            >
              <TableCellsIcon height={80} color="green" />
            </motion.div>
          )}
        </motion.div>
      </div>
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

export default DisclosureApp;
