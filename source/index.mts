import timers from "node:timers/promises";
import url from "node:url";
import fs from "node:fs/promises";

export async function time(
  title: string,
  function_: (() => void) | (() => Promise<void>)
) {
  const start = process.hrtime.bigint();
  await function_();
  time.report(title, elapsedTime(start));
}

time.report = (title: string, time: bigint): void => {
  console.log(`${title}: ${time}ms`);
};

export function elapsedTime(
  start: bigint,
  end: bigint = process.hrtime.bigint()
): bigint {
  return (end - start) / 1_000_000n;
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

export async function isExecuted(importMetaUrl: string): Promise<boolean> {
  return (
    url.fileURLToPath(importMetaUrl) === (await fs.realpath(process.argv[1]))
  );
}
