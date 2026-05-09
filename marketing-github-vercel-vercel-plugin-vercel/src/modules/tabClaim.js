import { copyIcon } from "../utils/copyHelper.js";

export function renderClaim(brand, lang) {
  const data = brand[lang];
  const tip = lang === "th"
    ? "กดที่คำไหนก็ได้เพื่อคัดลอกทันที — safe wording ใช้ได้ · risky wording หลีกเลี่ยง"
    : "Click any word to copy instantly — safe wording ✓ · risky wording to avoid ✗";
  return `
    <article class="card tip-card">${tip}</article>
    <div class="grid-2">
      <section class="claim-half safe">
        <div class="claim-hdr"><div class="claim-title safe">${lang === "th" ? "✓ คำที่ใช้ได้" : "✓ Safe Wording"}</div><button class="copy-btn" data-copy-id="safe-all">${copyIcon()} Copy All</button></div>
        <div class="claim-tags">${data.safeWords.map((w) => `<span class="claim-tag safe" data-word="${w}" onclick="copyClaimTag(this)">${w}</span>`).join("")}</div>
      </section>
      <section class="claim-half risky">
        <div class="claim-hdr"><div class="claim-title risky">${lang === "th" ? "✗ คำที่ต้องหลีกเลี่ยง" : "✗ Risky — Avoid"}</div><button class="copy-btn" data-copy-id="risky-all">${copyIcon()} Copy All</button></div>
        <div class="claim-tags">${data.riskyWords.map((w) => `<span class="claim-tag risky" data-word="${w}" onclick="copyClaimTag(this)">${w}</span>`).join("")}</div>
      </section>
    </div>
    <article class="card">
      <div class="card-label">${lang === "th" ? "ตัวอย่างประโยคที่ใช้ได้" : "Safe Sentence Examples"}</div>
      ${data.safeExamples.map((ex, i) => `<div class="ex-sentence"><span class="ex-text">${ex}</span><button class="copy-btn" data-copy-id="ex-safe-${i}">${copyIcon()} Copy</button></div>`).join("")}
    </article>
    <article class="card">
      <div class="card-label">${lang === "th" ? "ตัวอย่างที่ควรแก้" : "Risky Examples to Fix"}</div>
      ${data.riskyExamples.map((ex) => `<div class="ex-sentence ex-risky"><span class="ex-text">${ex}</span></div>`).join("")}
    </article>`;
}
