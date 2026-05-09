import { copyIcon } from "../utils/copyHelper.js";

export function buildPromptText(brand, lang) {
  const data = brand[lang];
  return `Brand: ${brand.name}
Category: ${data.category}
Positioning: ${data.positioning}

Logo Rules:
${data.logoRules.map((rule) => `- ${rule}`).join("\n")}

Brand Voice:
${data.voice}

Visual Style:
${data.visualStyle}

Claim Safety:
Safe wording: ${data.safeWords.join(", ")}
Risky wording to avoid: ${data.riskyWords.join(", ")}

Prompt Core:
${data.promptCore}`;
}

function formatPrompt(text) {
  return text.replace(/^(Brand:|Category:|Positioning:|Logo Rules:|Brand Voice:|Visual Style:|Claim Safety:|Prompt Core:)/gm, `<span class="prompt-section">$1</span>`);
}

export function renderPrompt(brand, lang) {
  const data = brand[lang];
  return `
    <article class="prompt-card">
      <div class="prompt-card-hdr">
        <div class="prompt-label">Brand Prompt Core <span class="prompt-ready">Ready to use</span></div>
        <button class="copy-btn-dark" data-copy-id="prompt-full">${copyIcon()} Copy All</button>
      </div>
      <div class="prompt-body">${formatPrompt(buildPromptText(brand, lang))}</div>
    </article>
    <div class="grid-2">
      <article class="card">
        <div class="card-hdr"><div class="card-label">Tone Description</div><button class="copy-btn" data-copy-id="promptcore">${copyIcon()} Copy</button></div>
        <p>${data.promptCore}</p>
      </article>
      <article class="card">
        <div class="card-label">How to use</div>
        <ul class="rule-list">
          <li><span class="rbullet rb-mint"></span><span>📋 ChatGPT — วางใน System Prompt / Paste in System Prompt</span></li>
          <li><span class="rbullet rb-purple"></span><span>🤖 Claude — วางต้น conversation / Paste at conversation start</span></li>
          <li><span class="rbullet rb-soft"></span><span>✨ Gemini — ใส่ใน context window / Add to context window</span></li>
        </ul>
      </article>
    </div>`;
}
