interface Stat {
  title: string;
  value: number;
  suffix: string;
}

const STATISTICS: Stat[] = [
  {
    title: "Components",
    value: 25,
    suffix: "+"
  },
  {
    title: "Foundations",
    value: 4,
    suffix: "+"
  },
  {
    title: "Schemas",
    value: 3,
    suffix: "+"
  },
  {
    title: "Blueprint",
    value: 1,
    suffix: ""
  }
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative mx-auto mb-18 flex flex-col justify-between gap-y-4 rounded-xl px-4 py-20">
      <div className="flex items-start justify-around gap-y-8">
        {STATISTICS.map((stat, index) => (
          <div key={index} className="pl-5">
            <div className="flex items-start gap-1">
              <h3 className="text-6xl font-bold">{stat.value}</h3>
              <p className="text-4xl text-muted-primary font-semibold">{stat.suffix}</p>
            </div>
            <p className="text-base uppercase text-muted-foreground font-medium">{stat.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
