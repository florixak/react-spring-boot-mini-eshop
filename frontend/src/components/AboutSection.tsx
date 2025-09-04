type AboutSectionProps = {
  title: string;
  description: string;
  bgClassName?: string;
  children: React.ReactNode;
  id?: string;
};

const AboutSection = ({
  title,
  description,
  bgClassName,
  children,
  id,
}: AboutSectionProps) => {
  return (
    <section
      id={id}
      className={`flex flex-col items-center justify-center text-center py-24 px-6 md:px-16 lg:px-28 font-playfair space-y-6 ${bgClassName}`}
    >
      <h2 className="text-3xl font-bold text-primary">{title}</h2>
      <p className="max-w-3xl mx-auto text-secondary-200 text-lg">
        {description}
      </p>
      {children}
    </section>
  );
};

export default AboutSection;
