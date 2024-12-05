import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

type InteractiveBlobProps = {
  baseX: number; // Base X position of the blob
  baseY: number; // Base Y position of the blob
  size?: number; // Size of the blob (default is 96px)
  gradient: string; // Tailwind gradient classes
  driftRange?: number; // Range of idle drifting (default is 20px)
};

const getRandomPosition = (base: number, range: number): number => {
  return base + Math.random() * range * (Math.random() < 0.5 ? -1 : 1);
};

const InteractiveBlob: React.FC<InteractiveBlobProps> = ({
  baseX,
  baseY,
  size = 200,
  gradient,
  driftRange = 20,
}) => {
  const controls = useAnimation(); // Framer Motion's animation controls

  // Randomly animate to a new position every few seconds
  const triggerRandomDrift = () => {
    const randomX = getRandomPosition(baseX, driftRange);
    const randomY = getRandomPosition(baseY, driftRange);

    controls.start({
      x: randomX,
      y: randomY,
      transition: {
        duration: Math.random() * 3 + 2, // Random duration between 2 and 5 seconds
        ease: "easeInOut",
      },
    });
  };

  // Use an interval to trigger the random motion periodically
  useEffect(() => {
    triggerRandomDrift(); // Trigger initial drift

    const interval = setInterval(() => {
      triggerRandomDrift();
    }, 3000); // Trigger new drift every 3 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <motion.div
      className={`absolute ${gradient} blur-3xl pointer-events-auto`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ x: baseX, y: baseY }} // Initial position
      animate={controls} // Controlled animation
      whileHover={{
        scale: 1.4,
        opacity: 0.2,
      }}
    ></motion.div>
  );
};

export default InteractiveBlob;
