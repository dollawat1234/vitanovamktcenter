import { copyIcon } from "../utils/copyHelper.js";

function list(items, bullet) {
  return `<ul class="rule-list">${items.map((item) => `<li><span class="rbullet ${bullet}"></span><span>${item}</span></li>`).join("")}</ul>`;
}

export function renderRules(brand, lang) {
  const data = brand[lang];
  return `
    <article class="card">
      <div class="card-hdr"><div class="card-label"><span class="card-label-pip rb-purple"></span>Logo Rules</div><button class="copy-btn" data-copy-id="logo">${copyIcon()} Copy</button></div>
      ${list(data.logoRules, "rb-purple")}
    </article>
    <div class="grid-2">
      <article class="card">
        <div class="card-hdr"><div class="card-label"><span class="card-label-pip rb-mint"></span>Do</div><button class="copy-btn" data-copy-id="do">${copyIcon()} Copy</button></div>
        ${list(data.doList, "rb-mint")}
      </article>
      <article class="card">
        <div class="card-hdr"><div class="card-label"><span class="card-label-pip rb-risky"></span>Don't</div><button class="copy-btn" data-copy-id="dont">${copyIcon()} Copy</button></div>
        ${list(data.dontList, "rb-risky")}
      </article>
    </div>`;
}
