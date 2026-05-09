import { copyIcon } from "../utils/copyHelper.js";

export function renderOverview(brand, lang) {
  const data = brand[lang];
  return `
    <section class="brand-hero">
      <div class="hero-accent-blob" style="background:${brand.colors[2]}"></div>
      <div class="hero-top">
        <div>
          <h1 class="hero-name">${brand.name}</h1>
          <div class="hero-cat">${data.category}</div>
          <div class="hero-channels">${data.channel.map((c) => `<span class="channel-pill">${c}</span>`).join("")}</div>
        </div>
        <div class="palette-row">
          ${brand.colors.map((hex) => `<div class="swatch-wrap"><div class="swatch" style="background:${hex}" data-hex="${hex}"></div><span class="swatch-hex" data-hex="${hex}">${hex}</span></div>`).join("")}
        </div>
      </div>
      <p class="hero-pos">${data.positioning}</p>
    </section>
    <div class="grid-2">
      <article class="card">
        <div class="card-hdr"><div class="card-label"><span class="card-label-pip rb-mint"></span>Brand Identity</div><button class="copy-btn" data-copy-id="identity">${copyIcon()} Copy</button></div>
        <ul class="rule-list">
          <li><span class="rbullet rb-mint"></span><span><strong>Positioning:</strong> ${data.positioning}</span></li>
          <li><span class="rbullet rb-mint"></span><span><strong>Audience:</strong> ${data.audience}</span></li>
          <li><span class="rbullet rb-mint"></span><span><strong>Channels:</strong> ${data.channel.join(", ")}</span></li>
        </ul>
      </article>
      <div>
        <article class="card card-mint-accent">
          <div class="card-hdr"><div class="card-label">Voice</div><button class="copy-btn" data-copy-id="voice-mini">${copyIcon()} Copy</button></div>
          <p>${data.voice}</p>
        </article>
        <article class="card card-purple-accent">
          <div class="card-hdr"><div class="card-label">Visual Style</div><button class="copy-btn" data-copy-id="visual-mini">${copyIcon()} Copy</button></div>
          <p>${data.visualStyle}</p>
        </article>
      </div>
    </div>`;
}
