type SectionHeaderProps = {
  title: string;
  description: string;
};

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className="text-center pt-36 pb-18 bg-secondary-50 space-y-5 font-playfair">
      <h2 className="text-4xl font-bold text-primary">{title}</h2>
      <p className="text-secondary-200 max-w-xl mx-auto">{description}</p>
    </div>
  );
};

export default SectionHeader;
