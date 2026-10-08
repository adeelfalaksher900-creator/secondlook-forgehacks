const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.SECONDLOOK_BROWSER_PATH || undefined,
    args: ["--no-sandbox"],
  });
  const c = await b.newContext({
    viewport: { width: 1440, height: 810 },
    recordVideo: { dir: "media/raw", size: { width: 1920, height: 1080 } },
  });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:4186");
  await p.waitForFunction(() => !document.getElementById("analyse").disabled);
  await p.addStyleTag({
    content:
      ".demo-pointer{position:fixed;width:18px;height:18px;border:2px solid #245b47;background:#d5e7b280;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}",
  });
  await p.evaluate(() => {
    const pointer = document.createElement("div");
    pointer.className = "demo-pointer";
    document.body.append(pointer);
    window.demoEvents = [];
    const start = performance.now();
    document.addEventListener("mousemove", (e) => {
      pointer.style.left = e.clientX + "px";
      pointer.style.top = e.clientY + "px";
      window.demoEvents.push({
        type: "move",
        t: (performance.now() - start) / 1000,
        x: e.clientX,
        y: e.clientY,
      });
    });
    document.addEventListener("click", (e) =>
      window.demoEvents.push({
        type: "click",
        t: (performance.now() - start) / 1000,
        x: e.clientX,
        y: e.clientY,
      }),
    );
  });
  const start = Date.now();
  const hold = async (t) => {
    const wait = t * 1000 - (Date.now() - start);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  };
  const click = async (sel) => {
    const l = p.locator(sel);
    await l.scrollIntoViewIfNeeded();
    const q = await l.boundingBox();
    await p.mouse.move(q.x + q.width * 0.5, q.y + q.height * 0.5, {
      steps: 30,
    });
    await l.click();
  };
  const scroll = async (dy) => {
    await p.mouse.move(1280, 700, { steps: 20 });
    for (let i = 0; i < 12; i++) {
      await p.mouse.wheel(0, dy / 12);
      await new Promise((r) => setTimeout(r, 45));
    }
  };
  await p.mouse.move(1050, 210, { steps: 30 });
  await hold(8);
  await click('[data-example="scholarship"]');
  await hold(15);
  await click("#analyse");
  await hold(24);
  await scroll(480);
  await hold(31);
  await click("summary");
  await hold(40);
  await scroll(-1200);
  await hold(45);
  await click('[data-example="parcel"]');
  await hold(49);
  await click("#analyse");
  await hold(54);
  await scroll(300);
  await hold(60);
  await scroll(-1200);
  await click('[data-example="account"]');
  await hold(66);
  await click("#analyse");
  await hold(72);
  await click("summary");
  await hold(78);
  await scroll(-1000);
  await click('[data-example="ordinary"]');
  await hold(83);
  await click("#analyse");
  await hold(89);
  await click("summary");
  await hold(98);
  await click("#clear");
  await p
    .locator("#message")
    .pressSequentially("Hi, quick question.", { delay: 130 });
  await hold(103);
  await click("#analyse");
  await hold(112);
  await click('[data-view="guide"]');
  await hold(118);
  await scroll(220);
  await hold(127);
  await click('[data-view="model"]');
  await hold(134);
  await scroll(320);
  await hold(145);
  await scroll(-1000);
  await hold(152);
  await click('[data-view="check"]');
  await click("#clear");
  await hold(158);
  fs.writeFileSync(
    "media/demo-events.json",
    JSON.stringify(await p.evaluate(() => window.demoEvents)),
  );
  const video = p.video();
  await c.close();
  fs.copyFileSync(await video.path(), "video/assets/workflow.webm");
  await b.close();
  console.log(
    "Continuous app capture completed, 158 seconds; narration pending.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
