import React from "react";
import { motion } from "framer-motion";
import { CATEGORIES, EMOJI_BY_CATEGORIES } from "../constants.ts";

interface IProps {
  result: number;
  title: string;
}

export const ResultView: React.FC<IProps> = (props) => {
  return (
    <motion.div
      className="w-full flex flex-col justify-around items-center max-w-[300px] h-[300px] rounded-md text-slate-700 font-bold text-8xl text-center mb-4 bg-white shadow-2xl"
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
    >
      {EMOJI_BY_CATEGORIES[CATEGORIES[props.result]]}

      <h1>{props.title}</h1>
    </motion.div>
  );
};
