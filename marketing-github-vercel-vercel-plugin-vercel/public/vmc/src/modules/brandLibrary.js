import { brands } from "../../data/brands.js";
import { activeLang, setLang, getD } from "../utils/langState.js";
import { copyClaimTag, copyText, setupPaletteCopy } from "../utils/copyHelper.js";
import { exportJSON } from "../utils/exportJson.js";
import { renderOverview } from "./tabOverview.js";
import { renderVoice } from "./tabVoice.js";
import { renderRules } from "./tabRules.js";
import { renderClaim } from "./tabClaim.js";
import { buildPromptText, renderPrompt } from "./tabPrompt.js";

let activeBrand = brands[0];
let activeTab = "overview";

export function getBrands() {
  return brands;
}

export function getActiveBrand() {
  return activeBrand;
}

export function getCurrentTab() {
  return activeTab;
}

function init() {
  window.copyClaimTag = copyClaimTag;
  window.setLang = setLang;
  renderBrandList(brands);
  renderTab("overview");
  setupTabs();
  setupSearch();
  document.querySelector("#btn-export")?.addEventListener("click", () => exportJSON(brands));
}

export function renderBrandList(list) {
  const wrap = document.querySelector("#brand-list");
  if (!wrap) return;
  wrap.innerHTML = list.map((brand) => {
    const data = getD(brand);
    const active = brand.id === activeBrand.id ? " active" : "";
    return `
      <article class="brand-card${active}" data-brand-id="${brand.id}">
        <div class="bcard-top">
          <span class="bcard-dot" style="background:${brand.colors[2]}"></span>
          <span class="bcard-name">${brand.name}</span>
        </div>
        <div class="bcard-pos">${data.shortPos}</div>
        <div class="bcard-tags">${data.channel.slice(0, 3).map((c) => `<span class="bcard-tag">${c}</span>`).join("")}</div>
      </article>`;
  }).join("");
  wrap.querySelectorAll(".brand-card").forEach((card) => {
    card.addEventListener("click", () => {
      const found = brands.find((brand) => brand.id === card.dataset.brandId);
      if (!found) return;
      activeBrand = found;
      renderBrandList(list);
      renderTab(activeTab);
    });
  });
}

export function renderTab(tab) {
  activeTab = tab;
  const target = document.querySelector("#tab-content");
  if (!target) return;
  const div = document.createElement("div");
  div.className = "fade";
  const renderMap = {
    overview: renderOverview,
    voice: renderVoice,
    rules: renderRules,
    claim: renderClaim,
    prompt: renderPrompt
  };
  div.innerHTML = renderMap[tab](activeBrand, activeLang);
  target.replaceChildren(div);
  attachCopyHandlers(tab);
}

function attachCopyHandlers(tab) {
  const data = getD(activeBrand);
  const channels = data.channel.join(", ");
  const values = {
    overview: {
      identity: `Positioning: ${data.positioning}\nAudience: ${data.audience}\nChannels: ${channels}`,
      "voice-mini": data.voice,
      "visual-mini": data.visualStyle
    },
    voice: {
      voice: data.voice,
      visual: data.visualStyle,
      audience: data.audience
    },
    rules: {
      logo: data.logoRules.map((r) => `- ${r}`).join("\n"),
      do: data.doList.map((r) => `✓ ${r}`).join("\n"),
      dont: data.dontList.map((r) => `✗ ${r}`).join("\n")
    },
    claim: {
      "safe-all": data.safeWords.join(", "),
      "risky-all": data.riskyWords.join(", "),
      "ex-safe-0": data.safeExamples[0],
      "ex-safe-1": data.safeExamples[1]
    },
    prompt: {
      "prompt-full": buildPromptText(activeBrand, activeLang),
      promptcore: data.promptCore
    }
  };

  document.querySelectorAll("#tab-content [data-copy-id]").forEach((btn) => {
    const id = btn.dataset.copyId;
    const value = btn.dataset.copyValue || values[tab]?.[id];
    if (value) btn.addEventListener("click", () => copyText(value, btn));
  });

  if (tab === "overview") setupPaletteCopy();
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tabEl) => {
    tabEl.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      tabEl.classList.add("active");
      renderTab(tabEl.dataset.tab);
    });
  });
}

function setupSearch() {
  const input = document.querySelector("#search-input");
  input?.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    const filtered = brands.filter((brand) => {
      const data = getD(brand);
      return [brand.name, data.shortPos, data.category].some((value) => value.toLowerCase().includes(q));
    });
    renderBrandList(filtered);
  });
}

document.addEventListener("DOMContentLoaded", init);
