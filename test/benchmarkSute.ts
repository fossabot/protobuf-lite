import * as benchmark from "benchmark";
import chalk from "chalk";

const padSize = 23;

export const newSuite = (name: string) => {
  const benches: any[] = [];

  return new benchmark.Suite(name)
    .on("add", (event: any) => benches.push(event.target))
    .on("start", () => {
      process.stdout.write(chalk.white.bold("benchmarking " + name + " performance ...") + "\n\n");
    })
    .on("cycle", (event: any) => process.stdout.write(String(event.target) + "\n"))
    .on("complete", () => {
      if (benches.length > 1) {
        benches.sort((a, b) => getHz(b) - getHz(a));
        const fastest = benches[0];
        const fastestHz = getHz(fastest);

        process.stdout.write(
          "\n" + chalk.white(pad(fastest.name, padSize)) + " was " + chalk.green("fastest") + "\n"
        );

        benches.slice(1).forEach(bench => {
          const hz = getHz(bench);
          const percent = 1 - hz / fastestHz;
          process.stdout.write(
            chalk.white(pad(bench.name, padSize)) +
              " was " +
              chalk.red(
                (percent * 100).toFixed(1) +
                  "% ops/sec slower (factor " +
                  (fastestHz / hz).toFixed(1) +
                  ")"
              ) +
              "\n"
          );
        });
      }
      process.stdout.write("\n");
    });
};

const getHz = (bench: any) => {
  return 1 / (bench.stats.mean + bench.stats.moe);
};

const pad = (str: string, len: number, l: boolean = false) => {
  while (str.length < len) str = l ? str + " " : " " + str;
  return str;
};
