import { copyIcon } from "../utils/copyHelper.js";

export function renderVoice(brand, lang) {
  const data = brand[lang];
  return `
    <article class="card card-mint-accent">
      <div class="card-hdr"><div class="card-label">Brand Voice</div><button class="copy-btn" data-copy-id="voice">${copyIcon()} Copy</button></div>
      <p class="quote">“${data.voice}”</p>
    </article>
    <article class="card card-purple-accent">
      <div class="card-hdr"><div class="card-label">Visual Style</div><button class="copy-btn" data-copy-id="visual">${copyIcon()} Copy</button></div>
      <p class="quote">“${data.visualStyle}”</p>
    </article>
    <article class="card">
      <div class="card-hdr"><div class="card-label">Audience</div><button class="copy-btn" data-copy-id="audience">${copyIcon()} Copy</button></div>
      <p>${data.audience}</p>
    </article>`;
}
