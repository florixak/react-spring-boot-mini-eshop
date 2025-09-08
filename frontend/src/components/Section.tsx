import { cn } from "@/lib/utils";

type Section = {
  title: string;
  description: string;
  bgClassName?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
};

const Section = ({
  title,
  description,
  bgClassName,
  className,
  children,
  id,
}: Section) => {
  return (
    <section
      id={id}
      className={cn(
        `flex flex-col items-center justify-center text-center py-24 px-4 md:px-16 lg:px-28 font-playfair space-y-6 ${bgClassName}`,
        className
      )}
    >
      <h2 className="text-3xl font-bold text-primary">{title}</h2>
      <p className="max-w-3xl mx-auto text-secondary-200 text-lg">
        {description}
      </p>
      {children}
    </section>
  );
};

export default Section;
