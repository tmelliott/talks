import React, { useState } from "react";

import {
  ArchiveBoxIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { motion } from "framer-motion";

type PageStateType = number;
const states: PageStateType[] = [0, 1, 2, 3, 4, 5];

const DisclosureApp = () => {
  const [state, setState] = useState<PageStateType>(0);

  const progressState = () => {
    setState((state) => Math.min(Math.max(...states), state + 1));
  };

  return (
    <div className="flex h-full flex-col justify-center gap-24">
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
        <div className={`relative transition-opacity`}>
          <UsersIcon height={180} />
          {state <= 1 && (
            <motion.div
              layoutId={"usersData"}
              className={`absolute -right-2 -top-10 transition-opacity`}
            >
              <TableCellsIcon height={80} color="green" />
            </motion.div>
          )}
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

export default DisclosureApp;
