import { Button } from "../ui/button";

type HeroProps = {
  title: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  image?: string;
  backgroundClass?: string;
};

const Hero = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  image,
  backgroundClass = "bg-amber-50",
}: HeroProps) => {
  return (
    <section
      className={`min-h-screen flex flex-col xl:flex-row gap-8 xl:gap-0 px-6 md:px-16 lg:px-28 py-24 xl:py-0 items-center justify-evenly ${backgroundClass}`}
    >
      <div>
        <h1 className="text-5xl font-bold text-primary font-playfair">
          {title}
          {subtitle && (
            <>
              <br />
              {subtitle}
            </>
          )}
        </h1>
        {description && (
          <h2 className="text-xl text-secondary-200 my-6 max-w-lg font-playfair">
            {description}
          </h2>
        )}
        <div className="flex gap-4">
          {primaryButton && (
            <Button
              variant="default"
              className="py-4 px-6"
              onClick={primaryButton.onClick}
            >
              {primaryButton.text}
            </Button>
          )}
          {secondaryButton && (
            <Button
              variant="outline"
              className="py-4 px-6"
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.text}
            </Button>
          )}
        </div>
      </div>
      {image && (
        <div className="relative w-full max-w-[580px] max-h-[580px] flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Hero Image"
            className="w-full h-auto object-cover object-center"
          />
        </div>
      )}
    </section>
  );
};

export default Hero;
