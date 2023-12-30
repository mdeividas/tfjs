import React from "react";
import { motion } from "framer-motion";

export const PlayView: React.FC = () => {
  const timer = React.useRef<number>(0);
  const [running, setRunning] = React.useState(false);
  const [leftTime, setLeftTime] = React.useState<number>(0);

  const onTick = () => {
    setLeftTime((time) => {
      window.clearTimeout(timer.current);
      if (time > 0) {
        setRunning(false);
        timer.current = window.setTimeout(onTick, 1000);

        return time - 1;
      }

      return time;
    });
  };

  const handleClick = () => {
    setRunning(true);
    setLeftTime(3);

    timer.current = window.setTimeout(onTick, 1000);
  };

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div>
      {leftTime > 0 && (
        <div className="bg-red-300">
          <motion.div
            key={leftTime}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
          >
            {leftTime}
          </motion.div>
        </div>
      )}

      <button onClick={handleClick} disabled={running}>
        Play view {leftTime}
      </button>
    </div>
  );
};
