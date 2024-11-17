import React from 'react';

type SectionProps = {
  children: React.ReactNode; // Content inside the section
  className?: string; // Optional class name for the <section> element
  innerClassName?: string; // Optional class name for the first inner <div>
};

const Section: React.FC<SectionProps> = ({ children, className = '', innerClassName = '' }) => {
  return (
    <section className={`h-screen flex justify-center items-center snap-center ${className}`}>
      <div className={`w-[95%] h-[90%] bg-background-light shadow-neumorphic rounded-md ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
