import test from "node:test";
import assert from "node:assert/strict";
import * as node from "./index.mjs";

test("time()", async () => {
  await node.time("Time summing up to of 1_000_000", () => {
    let sum = 0;
    for (let number = 0; number < 1_000_000; number++) sum += number;
  });
});

test("elapsedTime()", () => {
  assert.equal(node.elapsedTime(128020188396416n, 128041549262166n), 21360n);
});

// $ npm run prepare && node ./build/index.test.mjs
if (process.stdin.isTTY)
  test("eventLoopActive()", async () => {
    console.log("eventLoopActive(): Press ⌃C to continue");
    await node.eventLoopActive();
    console.log("eventLoopActive(): Continuing…");
  });

test("isExecuted()", async () => {
  assert(await node.isExecuted(import.meta.url));
  assert(
    !(await node.isExecuted(new URL("./index.mjs", import.meta.url).toString()))
  );
});
