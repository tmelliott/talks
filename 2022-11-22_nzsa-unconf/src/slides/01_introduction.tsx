import React, { useRef, useState } from "react";

import { motion, useInView } from "framer-motion";

import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
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
