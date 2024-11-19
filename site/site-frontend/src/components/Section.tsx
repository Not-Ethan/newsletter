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

  // Animation variants for the inner content
  const variants = {
    hidden: {
      opacity: 0,
      y: 20, // Start with a 20px offset below the natural position
    },
    visible: {
      opacity: 1,
      y: 0,  // Animate to the natural position
    },
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
        transition={{ duration: 0.6 }} // Adjust duration as needed
        className={`w-[95%] h-[90%] bg-background-light shadow-neumorphic rounded-md ${innerClassName}`}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default Section;
