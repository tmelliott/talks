import React, { useState } from "react";

import {
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

type PageStateType = number;
const states: PageStateType[] = [0, 1, 2, 3, 4, 5];

const Introduction = () => {
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
        <TableCellsIcon height={180} />
        <div className={`${state == 0 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>
        <div className={`${state === 4 && "opacity-10"} transition-opacity`}>
          <img src="/Rlogo.svg" alt="R Logo" height={180} width={180} />
        </div>
        <div
          className={`${
            (state <= 1 || state === 4) && "opacity-0"
          } transition-opacity`}
        >
          {state < 5 ? (
            <ArrowRightIcon height={60} />
          ) : (
            <ArrowsRightLeftIcon height={60} />
          )}
        </div>
        <div className={`${state === 4 && "opacity-10"} transition-opacity`}>
          <img
            src="/ReactLogo.svg"
            alt="ReactJS Logo"
            height={180}
            width={180}
          />
        </div>
        <div className={`${state <= 2 && "opacity-0"} transition-opacity`}>
          <ArrowsRightLeftIcon height={60} />
        </div>
        <UsersIcon height={180} />

        <div
          className={`absolute flex items-center justify-center text-2xl transition-opacity ${
            state === 4 ? "opacity-1" : "opacity-0"
          }`}
        >
          <img
            src="/shinyhex.png"
            alt="ReactJS Logo"
            height={180}
            width={180}
          />
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

export default Introduction;
