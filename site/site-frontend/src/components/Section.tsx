import React, { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  innerClassName = "",
}) => {
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { amount: 0.5 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={ref}
      className={`h-screen flex justify-center items-center snap-center ${className}`}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.6 }}
        className={`w-[100%] h-[100%] rounded-md ${innerClassName}`}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section;
