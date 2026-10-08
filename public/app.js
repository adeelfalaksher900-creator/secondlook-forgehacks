import { analyse } from "./engine.js";
const $ = (id) => document.getElementById(id);
let model;
const input = $("message");
let lastText = "";
const examples = {
  scholarship:
    "Congratulations! You have been selected for a student scholarship. Pay the processing fee of $49 within 2 hours to secure your award. Visit http://scholarship-claim.example/verify. Keep this confidential until your payment is confirmed.",
  parcel:
    "Final notice: your delivery is suspended. Pay a $2.99 redelivery fee immediately at http://192.0.2.4/parcel to avoid return to sender.",
  account:
    "Your university account will be suspended immediately. Reply with your password and verification code so we can restore access.",
  ordinary:
    "Hey, our study group is meeting in the library tomorrow at 3. Bring your notes from the lecture and we can work through the practice questions together.",
};
const node = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
function switchView(view) {
  document.querySelectorAll(".view").forEach((v) => (v.hidden = v.id !== view));
  document.querySelectorAll(".nav").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === view);
    b.setAttribute("aria-current", b.dataset.view === view ? "page" : "false");
  });
  $("crumb").textContent = {
    check: "Message check",
    guide: "Verification guide",
    model: "Behind the model",
  }[view];
  window.scrollTo(0, 0);
}
document
  .querySelectorAll(".nav")
  .forEach((b) =>
    b.addEventListener("click", () => switchView(b.dataset.view)),
  );
function reset() {
  input.value = "";
  lastText = "";
  $("count").textContent = "0 / 6,000";
  $("error").textContent = "";
  $("result").replaceChildren(empty.cloneNode(true));
  input.focus();
}
const empty = $("result").firstElementChild.cloneNode(true);
$("clear").addEventListener("click", reset);
input.addEventListener("input", () => {
  $("count").textContent = input.value.length.toLocaleString() + " / 6,000";
  if (input.value !== lastText) {
    $("result").replaceChildren(empty.cloneNode(true));
    $("error").textContent = "";
  }
});
document.querySelectorAll("[data-example]").forEach((b) =>
  b.addEventListener("click", () => {
    reset();
    input.value = examples[b.dataset.example];
    input.dispatchEvent(new Event("input"));
    input.focus();
  }),
);
function render(r) {
  const root = $("result");
  root.replaceChildren();
  const head = node("div", undefined, "status-head");
  head.append(
    node("p", "YOUR SECOND LOOK", "eyebrow"),
    node("h2", r.status),
    node("p", r.message),
  );
  root.append(head);
  if (r.signals.length) {
    root.append(node("p", "OBSERVABLE CUES", "section-label"));
    for (const s of r.signals) {
      const item = node("div", undefined, "signal");
      item.append(
        node("h3", s.title),
        node("mark", s.excerpt),
        node("p", s.why),
      );
      root.append(item);
    }
  } else
    root.append(
      node(
        "p",
        "No configured request cues found. This is not proof of authenticity.",
        "section-label",
      ),
    );
  if (r.links.length) {
    root.append(node("p", "LINKS · NEVER OPENED", "section-label"));
    for (const l of r.links) {
      const item = node("div", undefined, "link-row");
      item.append(node("b", l.display), node("p", l.note));
      root.append(item);
    }
  }
  const details = node("details", undefined, "ml-details");
  details.append(
    node(
      "summary",
      r.limited ? "ML context is limited" : "See the trained model’s evidence",
    ),
  );
  details.append(
    node(
      "p",
      r.limited
        ? "Short, unfamiliar, or non-English text falls outside this model’s useful scope. No spam score is shown."
        : `Historical SMS spam-pattern score: ${(r.probability * 100).toFixed(1)}%. This is not the likelihood of fraud. Word coverage: ${(r.coverage * 100).toFixed(0)}%.`,
    ),
  );
  if (!r.limited) {
    const chips = node("div", undefined, "chips");
    r.evidence.forEach((e) => chips.append(node("span", e.phrase)));
    details.append(
      chips,
      node(
        "p",
        "These phrases increased the model’s spam score. They do not prove malicious intent.",
      ),
    );
  }
  root.append(node("p", "MODEL TRANSPARENCY", "section-label"), details);
  const next = node("div", undefined, "next");
  next.append(
    node("h3", "Your next move: verify independently"),
    node(
      "p",
      "Open an official app or use a contact you already know. Ask whether they sent this exact request before sharing money or information.",
    ),
  );
  const b = node("button", "Open the verification guide");
  b.addEventListener("click", () => switchView("guide"));
  next.append(b);
  root.append(next);
  root.classList.remove("updated");
  void root.offsetWidth;
  root.classList.add("updated");
}
$("analyse").addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) {
    $("error").textContent = "Add a message before checking.";
    input.focus();
    return;
  }
  if (text.length > 6000) {
    $("error").textContent = "Use at most 6,000 characters.";
    return;
  }
  lastText = input.value;
  render(analyse(text, model));
});
fetch("model.json")
  .then((r) => {
    if (!r.ok) throw Error("load");
    return r.json();
  })
  .then((m) => {
    if (!m.vocabulary || !m.weights) throw Error("model");
    model = m;
    $("analyse").disabled = false;
    $("analyse").replaceChildren(
      node("span", "Check this message"),
      node("span", "↗"),
    );
  })
  .catch(() => {
    $("error").textContent =
      "The local model could not load. Reload to retry. You can still use the verification guide.";
    $("analyse").textContent = "Model unavailable";
  });
