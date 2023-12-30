import React from "react";
import { motion } from "framer-motion";
import { observer, inject } from "mobx-react";
import Store from "../store/store.ts";

interface IProps {
  onFinish(): void;
  store?: Store;
}

export const PlayView = inject("store")(
  observer((props: IProps) => {
    const timer = React.useRef<number>(0);
    const counterTimer = React.useRef<number>(0);
    const timeout = React.useRef<number>(0);
    const [leftTime, setLeftTime] = React.useState<number>(0);

    const onTick = () => {
      setLeftTime((time) => {
        window.clearTimeout(counterTimer.current);
        if (time > 0) {
          counterTimer.current = window.setTimeout(onTick, 1000);

          return time - 1;
        }

        return time;
      });
    };

    const handleClick = () => {
      props.store!.setProcessing(true);
      setLeftTime(3);

      timer.current = window.setTimeout(() => {
        props.onFinish();
        props.store!.setProcessing(false);

        timeout.current = window.setTimeout(() => {
          props.store!.resetResult();
        }, 4000);
      }, 3000);

      counterTimer.current = window.setTimeout(onTick, 1000);
    };

    React.useEffect(() => {
      return () => {
        window.clearTimeout(timer.current);
        window.clearTimeout(counterTimer.current);
        window.clearTimeout(timeout.current);
      };
    }, []);

    return (
      <div>
        {leftTime > 0 && (
          <motion.div
            key={leftTime}
            className="text-slate-700 md:text-white font-bold text-8xl text-center mb-4"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
          >
            {leftTime}
          </motion.div>
        )}

        {!leftTime && props.store!.score.player + props.store!.score.ai > 0 && (
          <div className="text-slate-700 md:text-white font-bold text-8xl text-center mb-4">
            {`${props.store!.score.player} : ${props.store!.score.ai}`}
          </div>
        )}

        <button
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 text-4xl rounded shadow"
          onClick={handleClick}
          disabled={props.store!.processing}
        >
          Click to play!
        </button>
      </div>
    );
  }),
);
