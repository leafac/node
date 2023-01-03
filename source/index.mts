import timers from "node:timers/promises";

export async function time(
  title: string,
  function_: (() => void) | (() => Promise<void>)
) {
  const start = process.hrtime.bigint();
  await function_();
  time.report(title, (process.hrtime.bigint() - start) / 1_000_000n);
}

time.report = (title: string, time: bigint): void => {
  console.log(`${title}: ${time}ms`);
};

if (process.env.TEST === "@leafac/node") {
  await time("Time summing up to of 1_000_000", () => {
    let sum = 0;
    for (let number = 0; number < 1_000_000; number++) sum += number;
  });
}

export function eventLoopActive(): Promise<void> {
  return new Promise<void>((resolve) => {
    const abortController = new AbortController();
    timers
      .setInterval(1 << 30, undefined, {
        signal: abortController.signal,
      })
      [Symbol.asyncIterator]()
      .next()
      .catch(() => {});
    for (const event of [
      "exit",
      "SIGHUP",
      "SIGINT",
      "SIGQUIT",
      "SIGTERM",
      "SIGUSR2",
      "SIGBREAK",
    ])
      process.on(event, () => {
        abortController.abort();
        resolve();
      });
  });
}

if (process.env.TEST === "@leafac/node" && process.stdin.isTTY) {
  console.log("eventLoopActive(): Press ⌃C to continue");
  await eventLoopActive();
  console.log("eventLoopActive(): Cleaning up");
}
