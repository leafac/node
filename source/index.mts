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
