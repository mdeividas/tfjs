import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, EMOJI_BY_CATEGORIES } from '../constants.ts';

interface IProps {
    result: number;
    title: string;
}

export const ResultView: React.FC<IProps> = (props) => {
    return (
        <motion.div
            className="flex flex-1 flex-col justify-around items-center gap-8 max-w-[150px] md:max-w-[300px] h-[150px] md:h-[300px] rounded-md text-slate-700 font-bold text-4xl md:text-8xl text-center mb-4 bg-white shadow-2xl"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
        >
            <span className="text-6xl md:text-8xl">{EMOJI_BY_CATEGORIES[CATEGORIES[props.result]]}</span>

            <h1>{props.title}</h1>
        </motion.div>
    );
};
