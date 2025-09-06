import { STATISTICS } from "@/constants";

const Statistics = () => {
  return (
    <section className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-4 py-24 px-6 md:px-16 lg:px-28">
      {STATISTICS.map((statistic) => (
        <div key={statistic.title} className="text-center space-y-2">
          <h3 className="text-primary text-3xl md:text-4xl font-bold">
            {statistic.value}
          </h3>
          <p className="text-secondary-200 text-md md:text-lg">
            {statistic.title}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Statistics;
