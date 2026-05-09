import { getActiveBrand, getCurrentTab, renderBrandList, renderTab, getBrands } from "../modules/brandLibrary.js";

export let activeLang = "th";

export function setLang(lang) {
  activeLang = lang;
  document.querySelectorAll(".lang-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`#btn-${lang}`)?.classList.add("active");
  renderBrandList(getBrands());
  renderTab(getCurrentTab(), getActiveBrand());
}

export function getD(brand) {
  return brand[activeLang];
}

window.setLang = setLang;
