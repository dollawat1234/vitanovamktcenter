const SVG_COPY = `<svg viewBox="0 0 13 13" fill="none"><path d="M4.5 4.5h5v5h-5v-5Z" stroke="currentColor" stroke-width="1.1"/><path d="M3.1 8H2.2V2.2H8v.9" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`;
const SVG_CHECK = `<svg viewBox="0 0 13 13" fill="none"><path d="M10.8 3.4 5.2 9 2.4 6.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

async function writeClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

export async function copyText(text, btnEl) {
  await writeClipboard(text);
  if (btnEl) {
    const old = btnEl.innerHTML;
    btnEl.innerHTML = `${SVG_CHECK} Copied`;
    btnEl.classList.add("copied");
    window.setTimeout(() => {
      btnEl.innerHTML = old;
      btnEl.classList.remove("copied");
    }, 1800);
    return;
  }
  const ok = document.querySelector("#global-copy-ok");
  ok?.classList.add("show");
  window.setTimeout(() => ok?.classList.remove("show"), 1800);
}

export async function copyClaimTag(el) {
  const word = el.dataset.word || el.textContent;
  const old = el.textContent;
  await writeClipboard(word);
  el.textContent = `✓ ${word}`;
  el.classList.add("tag-copied");
  window.setTimeout(() => {
    el.textContent = old;
    el.classList.remove("tag-copied");
  }, 1500);
}

export function setupPaletteCopy() {
  document.querySelectorAll(".swatch").forEach((el) => {
    el.onclick = async () => {
      const hex = el.dataset.hex || "";
      await copyText(hex);
      const old = el.innerHTML;
      el.innerHTML = `<span class="swatch-mark">✓</span>`;
      window.setTimeout(() => {
        el.innerHTML = old;
      }, 1000);
    };
  });
  document.querySelectorAll(".swatch-hex").forEach((el) => {
    el.onclick = async () => {
      const hex = el.dataset.hex || "";
      const old = el.textContent;
      await copyText(hex);
      el.textContent = "✓ Copied";
      window.setTimeout(() => {
        el.textContent = old;
      }, 1000);
    };
  });
}

export function makeCopyBtn(text, dark = false) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = dark ? "copy-btn-dark" : "copy-btn";
  btn.innerHTML = `${SVG_COPY} Copy`;
  btn.onclick = () => copyText(text, btn);
  return btn;
}

export function copyIcon() {
  return SVG_COPY;
}
