"use client";

import { useMemo, useState } from "react";

type Lang = "th" | "en";
type Tab = "overview" | "voice" | "rules" | "claim" | "prompt";

type Brand = {
  id: string;
  name: string;
  colors: string[];
  th: BrandText;
  en: BrandText;
};

type BrandText = {
  category: string;
  shortPos: string;
  channel: string[];
  positioning: string;
  audience: string;
  voice: string;
  visualStyle: string;
  logoRules: string[];
  doList: string[];
  dontList: string[];
  safeWords: string[];
  riskyWords: string[];
  safeExamples: string[];
  riskyExamples: string[];
  promptCore: string;
};

const brands: Brand[] = [
  {
    id: "natwell",
    name: "Natwell",
    colors: ["#FFFFFF", "#E9F5EC", "#77A87D", "#315C3B"],
    th: {
      category: "อาหารเสริม / สุขภาพ",
      shortPos: "พรีเมียม เวลเนส",
      channel: ["อาหารเสริม", "Facebook", "ออนไลน์"],
      positioning: "แบรนด์อาหารเสริมพรีเมียมที่เน้นสารสกัดธรรมชาติ ดูแลสุขภาพในระยะยาว สำหรับผู้ใหญ่ที่ใส่ใจตัวเอง",
      audience: "ผู้ใหญ่อายุ 30+ ที่รักสุขภาพ สนใจการดูแลตัวเองอย่างต่อเนื่อง",
      voice: "ผู้เชี่ยวชาญด้านสุขภาพที่เป็นมิตร พรีเมียมแต่เข้าถึงได้ สงบ ให้ข้อมูลโดยไม่กดดัน",
      visualStyle: "พรีเมียมเวลเนส พื้นขาวสะอาด ลวดลายพฤกษศาสตร์ บรรยากาศธรรมชาติผสมวิทยาศาสตร์",
      logoRules: ["ใช้โลโก้ Natwell อย่างชัดเจนและสะอาด", "ห้ามบิดเบือน ยืด เปลี่ยนสี หรือออกแบบใหม่", "วางโลโก้ให้ดูพรีเมียม ไม่รกรุงรัง"],
      doList: ["ใช้การให้ข้อมูลสุขภาพที่เข้าใจง่าย", "เน้นสารสกัดธรรมชาติและประโยชน์ในชีวิตประจำวัน", "ใช้ภาษาพรีเมียมแต่เป็นกันเอง"],
      dontList: ["ห้ามอ้างว่ารักษาโรค", "ห้ามเกินจริงเรื่องต้านวัยชรา", "หลีกเลี่ยงโทนถูกๆ ลดราคาหนัก"],
      safeWords: ["ช่วยเสริม", "ดูแลสุขภาพ", "ใช้เป็นประจำ", "สารสกัดธรรมชาติ"],
      riskyWords: ["รักษาโรค", "หายขาด", "ย้อนวัย", "ลดน้ำหนักแน่นอน"],
      safeExamples: ["ช่วยเสริมความแข็งแรงของร่างกาย เมื่อใช้เป็นประจำ", "สารสกัดธรรมชาติคัดสรรมา ดูแลสุขภาพในระยะยาว"],
      riskyExamples: ["❌ 'รักษาโรคได้จริง' → ใช้: 'ช่วยดูแลสุขภาพ'", "❌ 'ย้อนวัยได้' → ใช้: 'ดูแลผิวพรรณจากภายใน'"],
      promptCore: "Natwell พูดในฐานะผู้เชี่ยวชาญเวลเนสที่อบอุ่นและน่าเชื่อถือ โทนเสียงควรชัดเจน อ่อนโยน และให้ความรู้ ภาพลักษณ์ควรสื่อถึงธรรมชาติผสมวิทยาศาสตร์ในแบบพรีเมียม หลีกเลี่ยงการอ้างเกินจริงเรื่องโรคหรือต้านวัย"
    },
    en: {
      category: "Supplement / Wellness",
      shortPos: "Premium Natural Wellness",
      channel: ["Supplement", "Facebook", "Online"],
      positioning: "Premium supplement brand focused on natural extracts, pro-aging, and daily wellness.",
      audience: "Adults 30+, health-conscious consumers, people interested in aging well.",
      voice: "Warm health expert, premium but easy to understand, calm, evidence-aware, not hard-selling.",
      visualStyle: "Premium wellness, clean white base, botanical accents, modern natural science mood.",
      logoRules: ["Use the official Natwell logo clearly and cleanly.", "Do not distort, stretch, recolor, or redesign the logo.", "Keep logo placement premium and uncluttered."],
      doList: ["Use simple health education.", "Highlight natural extracts and daily routine benefits.", "Use premium but approachable language."],
      dontList: ["Do not claim disease treatment.", "Do not overpromise anti-aging results.", "Avoid cheap discount-heavy tone."],
      safeWords: ["ช่วยเสริม", "ดูแลสุขภาพ", "ใช้เป็นประจำ", "สารสกัดธรรมชาติ"],
      riskyWords: ["รักษาโรค", "หายขาด", "ย้อนวัย", "ลดน้ำหนักแน่นอน"],
      safeExamples: ["Helps support overall body strength when used regularly.", "Carefully selected natural extracts for long-term health care."],
      riskyExamples: ["❌ 'Treats disease' → Use: 'Supports health'", "❌ 'Reverses aging' → Use: 'Nourishes from within'"],
      promptCore: "Natwell speaks like a warm premium wellness expert. The tone should be clear, gentle, trustworthy, and educational. Use a clean premium natural-science visual direction. Avoid exaggerated disease or anti-aging claims."
    }
  },
  {
    id: "vitus",
    name: "VitUS",
    colors: ["#FFFFFF", "#EEF3FA", "#1E4E8C", "#D72828"],
    th: {
      category: "วิตามิน / อาหารเสริม",
      shortPos: "วิตามินนำเข้า USA",
      channel: ["ร้านขายยา", "Facebook", "Shopee", "ออนไลน์"],
      positioning: "วิตามินนำเข้าจากสหรัฐอเมริกา คุณภาพเชื่อถือได้ เพื่อการดูแลสุขภาพประจำวัน",
      audience: "ผู้ชายและผู้หญิงวัยกลางคนที่ต้องการวิตามินคุณภาพจากอเมริกา",
      voice: "เชื่อถือได้ ตรงไปตรงมา เชี่ยวชาญ ใช้งานจริง เน้นคุณภาพ อ่านง่าย",
      visualStyle: "คุณภาพวิตามินนำเข้าจากอเมริกา โมเดิร์นแบบร้านขายยา ชัดเจน",
      logoRules: ["ใช้โลโก้ VitUS ให้อ่านชัดเจน", "รักษาความรู้สึกวิตามินนำเข้าคุณภาพ", "หลีกเลี่ยงการทำให้ดูถูกหรือไม่มีเอกลักษณ์"],
      doList: ["กล่าวถึงคุณภาพนำเข้าเมื่อเหมาะสม", "อธิบายประโยชน์ในแง่ชีวิตประจำวัน", "รักษาการเคลมที่ปลอดภัยตามมาตรฐานอาหารเสริม"],
      dontList: ["ห้ามอ้างว่ารักษาโรค", "ห้ามใช้ภาษา miracle-cure", "หลีกเลี่ยงโทนสนุกเกินไป"],
      safeWords: ["วิตามินนำเข้า", "คุณภาพจากอเมริกา", "ดูแลสุขภาพประจำวัน", "เสริมโภชนาการ"],
      riskyWords: ["รักษา", "ป้องกันโรค", "หายแน่นอน", "เห็นผลทันที"],
      safeExamples: ["วิตามินนำเข้าจากอเมริกา มาตรฐานคุณภาพที่เชื่อถือได้", "เสริมโภชนาการที่ร่างกายต้องการ ดูแลสุขภาพประจำวัน"],
      riskyExamples: ["❌ 'รักษาโรค' → ใช้: 'ดูแลสุขภาพ'", "❌ 'เห็นผลทันที' → ใช้: 'ใช้ต่อเนื่องสม่ำเสมอ'"],
      promptCore: "VitUS พูดในฐานะผู้เชี่ยวชาญวิตามินนำเข้าที่น่าเชื่อถือ โทนเสียงตรงไปตรงมา ใช้งานจริง เน้นคุณภาพ USA และการดูแลสุขภาพประจำวัน ไม่อ้างรักษาโรค"
    },
    en: {
      category: "Vitamin / Supplement",
      shortPos: "USA Quality Vitamin",
      channel: ["Pharmacy", "Facebook", "Shopee", "Online"],
      positioning: "Imported USA-quality vitamins for trustworthy daily health support.",
      audience: "Middle-aged men and women looking for reliable vitamins from America.",
      voice: "Trustworthy, direct, expert, practical, quality-focused, easy to read.",
      visualStyle: "Clean American vitamin quality, pharmacy-modern, strong product clarity.",
      logoRules: ["Use the official VitUS logo with clear readability.", "Keep a quality imported vitamin feeling.", "Avoid making the brand look cheap or generic."],
      doList: ["Mention imported quality when appropriate.", "Explain benefits in practical daily-life terms.", "Keep claims responsible and supplement-safe."],
      dontList: ["Do not claim to treat disease.", "Do not use miracle-cure language.", "Avoid overly playful tone."],
      safeWords: ["วิตามินนำเข้า", "คุณภาพจากอเมริกา", "ดูแลสุขภาพประจำวัน", "เสริมโภชนาการ"],
      riskyWords: ["รักษา", "ป้องกันโรค", "หายแน่นอน", "เห็นผลทันที"],
      safeExamples: ["Imported from America — trusted vitamin quality.", "Supplement the nutrients your body needs every day."],
      riskyExamples: ["❌ 'Treats disease' → Use: 'Supports health'", "❌ 'See results immediately' → Use: 'Use consistently'"],
      promptCore: "VitUS speaks like a trustworthy imported vitamin expert. The tone should be direct, practical, and quality-focused. Emphasize USA-quality and daily health support without disease treatment claims."
    }
  },
  {
    id: "ella",
    name: "Ella",
    colors: ["#FFFFFF", "#EAF7F6", "#78C6C8", "#1C8B8F"],
    th: {
      category: "เวชสำอาง / ร้านขายยา",
      shortPos: "เวชสำอาง ร้านขายยา",
      channel: ["ร้านขายยา", "Facebook", "TikTok", "ออนไลน์"],
      positioning: "แบรนด์เวชสำอางที่น่าเชื่อถือในช่องทางร้านขายยา สำหรับปัญหาผิวที่ต้องการการดูแลจริงจัง",
      audience: "ผู้บริโภคที่ต้องการโซลูชันแก้ปัญหาผิวจากช่องทางร้านขายยาที่น่าเชื่อถือ",
      voice: "ผู้เชี่ยวชาญเวชสำอางร้านขายยา อ่อนโยน นำด้วยวิทยาศาสตร์ ไม่เกินจริง",
      visualStyle: "พรีเมียม shelf-impact ร้านขายยา คลินิกแต่จดจำได้ เน้นส่วนผสมสำคัญ",
      logoRules: ["ใช้โลโก้ Ella อย่างชัดเจนเป็น brand identity หลัก", "ห้ามบิดเบือน ออกแบบใหม่ หมุน ยืด หรือเปลี่ยนสี", "โลโก้ควรดูสะอาด พรีเมียม เหมาะกับชั้นวางร้านขายยา"],
      doList: ["ใช้คำพูดแบบร้านขายยาที่น่าเชื่อถือ", "เน้นส่วนผสมออกฤทธิ์อย่างชัดเจน", "รักษาการเคลมที่อ่อนโยน รับผิดชอบ และอ้างอิงวิทยาศาสตร์", "ทำภาพให้น่าจดจำ ไม่มินิมัลเกินไป"],
      dontList: ["ห้ามอ้างหายขาด 100%", "ห้ามใช้คำว่า เห็นผลทันที หรือ ลบหายสนิท", "หลีกเลี่ยงการดูเหมือนน้ำหอมหรู หรือยาโรงพยาบาล"],
      safeWords: ["ช่วยดูแล", "ผิวบริเวณรอยแผล", "ใช้ต่อเนื่อง", "เวชสำอาง", "สูตรซิลิโคนเจล"],
      riskyWords: ["ลบรอย 100%", "หายขาด", "เห็นผลทันที", "รักษาแผลเป็น", "รับประกันผล"],
      safeExamples: ["ช่วยดูแลผิวบริเวณรอยแผล ด้วยสูตรซิลิโคนเจลที่ใช้ต่อเนื่อง", "เวชสำอางที่ผ่านการพิสูจน์ทางคลินิก ดูแลผิวอย่างอ่อนโยน"],
      riskyExamples: ["❌ 'ลบรอย 100%' → ใช้: 'ช่วยดูแลรอยให้จางลง'", "❌ 'รักษาแผลเป็น' → ใช้: 'ดูแลผิวบริเวณรอยแผล'"],
      promptCore: "Ella พูดในฐานะผู้เชี่ยวชาญเวชสำอางร้านขายยา โทนเสียงน่าเชื่อถือ อ่อนโยน นำด้วยวิทยาศาสตร์ เข้าใจง่าย หลีกเลี่ยงการอ้างสรรพคุณทางยาเกินจริง ภาพควรดูพรีเมียมในแบบร้านขายยา เน้นส่วนผสม"
    },
    en: {
      category: "Cosmeceutical / Pharmacy",
      shortPos: "Pharmacy Cosmeceutical",
      channel: ["Pharmacy", "Facebook", "TikTok", "Online"],
      positioning: "Credible pharmacy cosmeceutical brand for treatment-oriented skin concerns.",
      audience: "Consumers seeking credible skin concern solutions from pharmacy channels.",
      voice: "Credible pharmacy cosmeceutical expert, gentle, science-led, not exaggerated.",
      visualStyle: "Premium pharmacy shelf-impact, clinical but memorable, ingredient-led visual identity.",
      logoRules: ["Use the official Ella logo clearly as the main brand identity.", "Do not distort, redesign, rotate, stretch, or recolor the logo.", "Logo should appear clean, premium, and suitable for pharmacy shelves."],
      doList: ["Use credible pharmacy-style wording.", "Highlight active ingredients clearly.", "Keep claims soft, responsible, and science-led.", "Make visuals memorable, not plain minimalist."],
      dontList: ["Do not claim complete cure or 100% result.", "Do not use words like instant result or erase completely.", "Avoid looking like luxury perfume or hospital medicine."],
      safeWords: ["ช่วยดูแล", "ผิวบริเวณรอยแผล", "ใช้ต่อเนื่อง", "เวชสำอาง", "สูตรซิลิโคนเจล"],
      riskyWords: ["ลบรอย 100%", "หายขาด", "เห็นผลทันที", "รักษาแผลเป็น", "รับประกันผล"],
      safeExamples: ["Helps care for skin around wound areas with silicone gel formula.", "Clinically tested cosmeceutical for gentle skin care."],
      riskyExamples: ["❌ 'Erases 100%' → Use: 'Helps fade the appearance'", "❌ 'Treats scars' → Use: 'Cares for skin around wound areas'"],
      promptCore: "Ella speaks like a credible pharmacy cosmeceutical expert. The tone should be trustworthy, gentle, science-led, and easy to understand. Avoid exaggerated medical claims. Visuals should be premium pharmacy shelf-impact, ingredient-led, and not too plain."
    }
  },
  {
    id: "airizu",
    name: "Airizu",
    colors: ["#FFFFFF", "#F4F7FA", "#B8D8E8", "#6E93A8"],
    th: {
      category: "สกินแคร์",
      shortPos: "สกินแคร์ญี่ปุ่น เบาบาง",
      channel: ["สกินแคร์", "Facebook", "TikTok", "Shopee"],
      positioning: "สกินแคร์แรงบันดาลใจจากญี่ปุ่น เนื้อสัมผัสเบา ผิวสะอาด ใช้ได้ทุกวัน",
      audience: "ผู้บริโภคที่ชอบสกินแคร์เนื้อเบา รู้สึกสบายผิว และ routine ที่ง่าย",
      voice: "อ่อนโยน สะอาด นุ่มนวล ได้รับแรงบันดาลใจจากญี่ปุ่น เรียบง่ายและประณีต",
      visualStyle: "สกินแคร์ขาวสะอาด โปร่ง แสงนุ่ม บรรยากาศบิวตี้ญี่ปุ่นมินิมัล",
      logoRules: ["ใช้โลโก้ Airizu อย่างนุ่มนวลและสะอาด", "รักษาความอ่านง่ายและประณีต", "หลีกเลี่ยงการวางโลโก้ที่ดูดัง"],
      doList: ["เน้นเนื้อสัมผัสเบาและความสบายผิว", "ใช้คำที่นุ่มนวล สงบ ประณีต", "รักษาภาพให้โปร่ง สดชื่น"],
      dontList: ["ห้ามทำให้ดูเหมือนทางการแพทย์", "ห้ามใช้สไตล์หรูหราหนัก", "หลีกเลี่ยงการขายแบบก้าวร้าว"],
      safeWords: ["บางเบา", "สบายผิว", "ดูแลผิว", "อ่อนโยน", "ใช้ได้ทุกวัน"],
      riskyWords: ["ขาวถาวร", "รักษาฝ้า", "หายทันที", "หน้าเด็กลงทันที"],
      safeExamples: ["เนื้อบางเบา สบายผิว อ่อนโยนสำหรับผิวทุกประเภท ใช้ได้ทุกวัน", "ดูแลผิวอย่างประณีตด้วยสกินแคร์แรงบันดาลใจจากญี่ปุ่น"],
      riskyExamples: ["❌ 'ขาวถาวร' → ใช้: 'บำรุงผิวให้กระจ่างใส'", "❌ 'รักษาฝ้า' → ใช้: 'ดูแลผิวให้ดูสม่ำเสมอ'"],
      promptCore: "Airizu พูดด้วยเสียงสกินแคร์แบบญี่ปุ่นที่อ่อนโยน โทนเสียงนุ่มนวล สะอาด ประณีต และเรียบง่าย ภาพควรรู้สึกโปร่ง เบา สดชื่น เหมาะกับสกินแคร์ประจำวัน"
    },
    en: {
      category: "Skincare",
      shortPos: "Japanese Light Skincare",
      channel: ["Skincare", "Facebook", "TikTok", "Shopee"],
      positioning: "Japanese-inspired skincare with light texture, clean feel, and gentle daily use.",
      audience: "Consumers who prefer lightweight skincare, clean skin feel, and simple routines.",
      voice: "Soft, clean, gentle, Japanese-inspired, simple and refined.",
      visualStyle: "White clean skincare, airy, soft light, minimal Japanese beauty mood.",
      logoRules: ["Use Airizu logo softly and cleanly.", "Keep the logo readable and refined.", "Avoid overly loud logo placement."],
      doList: ["Emphasize light texture and clean skin feel.", "Use soft, calming, refined wording.", "Keep visuals airy and fresh."],
      dontList: ["Do not make it look too medical.", "Do not use heavy luxury style.", "Avoid strong aggressive selling."],
      safeWords: ["บางเบา", "สบายผิว", "ดูแลผิว", "อ่อนโยน", "ใช้ได้ทุกวัน"],
      riskyWords: ["ขาวถาวร", "รักษาฝ้า", "หายทันที", "หน้าเด็กลงทันที"],
      safeExamples: ["Lightweight, skin-comfortable formula gentle for all skin types.", "Refined Japanese-inspired daily skincare routine."],
      riskyExamples: ["❌ 'Permanently whitens' → Use: 'Brightens skin tone'", "❌ 'Treats melasma' → Use: 'Helps even out skin appearance'"],
      promptCore: "Airizu speaks with a soft Japanese-inspired skincare voice. The tone should be gentle, clean, refined, and simple. Visuals should feel airy, lightweight, fresh, and suitable for daily skincare."
    }
  },
  {
    id: "klear",
    name: "Klear",
    colors: ["#FFFFFF", "#F1F5F9", "#2563EB", "#111827"],
    th: {
      category: "ร้านขายยา / แก้ปัญหา",
      shortPos: "โซลูชันร้านขายยา",
      channel: ["ร้านขายยา", "Facebook", "Line"],
      positioning: "แบรนด์ร้านขายยาที่เข้าถึงง่าย แก้ปัญหาตรงจุด เข้าใจง่าย ใช้งานได้จริง",
      audience: "ผู้บริโภคที่ต้องการโซลูชันง่ายๆ จากช่องทางร้านขายยา",
      voice: "ชัดเจน ใช้งานจริง เป็นกันเอง แก้ปัญหาได้ เข้าใจง่าย",
      visualStyle: "ร้านขายยาที่เข้าถึงได้ บล็อกประโยชน์ชัด คอนทราสต์เข้ม อ่านง่าย",
      logoRules: ["ใช้โลโก้ Klear อย่างชัดเจนและเรียบง่าย", "รักษาความอ่านง่ายแม้ขนาดเล็ก", "ห้ามตกแต่งพื้นที่โลโก้มากเกินไป"],
      doList: ["อธิบายปัญหาและโซลูชันชัดเจน", "ใช้ภาษาที่ใช้งานจริง", "ทำให้ประโยชน์หลักเห็นชัดเจน"],
      dontList: ["ห้ามอ้างเกินจริง", "หลีกเลี่ยงคำศัพท์เทคนิคซับซ้อน", "หลีกเลี่ยงโทนหรูหราพรีเมียมเกินไป"],
      safeWords: ["ช่วยดูแล", "ใช้ง่าย", "เหมาะสำหรับ", "ดูแลปัญหาเบื้องต้น"],
      riskyWords: ["รักษาหาย", "รับประกัน", "หายขาด", "แรงที่สุด"],
      safeExamples: ["ช่วยดูแลปัญหาเบื้องต้น ใช้ง่าย เหมาะสำหรับทุกคน", "แก้ปัญหาตรงจุด ด้วยสูตรที่เข้าใจง่าย"],
      riskyExamples: ["❌ 'รักษาหาย 100%' → ใช้: 'ช่วยดูแลอาการเบื้องต้น'", "❌ 'แรงที่สุด' → ใช้: 'ประสิทธิภาพที่ผ่านการทดสอบ'"],
      promptCore: "Klear พูดในฐานะนักแก้ปัญหาในร้านขายยา โทนเสียงชัดเจน เป็นมิตร เรียบง่าย และมีประโยชน์ ภาพควรเข้าใจง่ายด้วยบล็อกประโยชน์ที่ชัดเจนและอ่านง่าย"
    },
    en: {
      category: "Pharmacy / Problem-solution",
      shortPos: "Practical Pharmacy Solution",
      channel: ["Pharmacy", "Facebook", "Line"],
      positioning: "Accessible pharmacy problem-solution brand that is easy to understand and practical.",
      audience: "Consumers looking for simple, accessible solutions in pharmacy channels.",
      voice: "Clear, practical, friendly, problem-solving, easy to understand.",
      visualStyle: "Pharmacy-accessible, clear benefit blocks, simple strong contrast, easy to read.",
      logoRules: ["Use Klear logo clearly and simply.", "Keep logo readable at small sizes.", "Do not overdecorate the logo area."],
      doList: ["Explain problem and solution clearly.", "Use practical language.", "Make key benefit easy to see."],
      dontList: ["Do not overclaim.", "Avoid complex technical wording.", "Avoid overly premium luxury tone."],
      safeWords: ["ช่วยดูแล", "ใช้ง่าย", "เหมาะสำหรับ", "ดูแลปัญหาเบื้องต้น"],
      riskyWords: ["รักษาหาย", "รับประกัน", "หายขาด", "แรงที่สุด"],
      safeExamples: ["Helps address initial concerns — easy to use and suitable for everyone.", "Solve problems directly with a simple, easy-to-understand formula."],
      riskyExamples: ["❌ 'Cures 100%' → Use: 'Helps manage initial symptoms'", "❌ 'Most powerful' → Use: 'Tested efficacy'"],
      promptCore: "Klear speaks like a practical pharmacy problem-solver. The tone should be clear, friendly, simple, and useful. Visuals should be easy to understand with clear benefit blocks and strong readability."
    }
  }
];

function buildPrompt(brand: Brand, lang: Lang) {
  const d = brand[lang];
  return `Brand: ${brand.name}\nCategory: ${d.category}\nPositioning: ${d.positioning}\n\nLogo Rules:\n${d.logoRules.map((x) => `- ${x}`).join("\n")}\n\nBrand Voice:\n${d.voice}\n\nVisual Style:\n${d.visualStyle}\n\nClaim Safety:\nSafe wording: ${d.safeWords.join(", ")}\nRisky wording to avoid: ${d.riskyWords.join(", ")}\n\nPrompt Core:\n${d.promptCore}`;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("th");
  const [activeId, setActiveId] = useState("natwell");
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const active = brands.find((brand) => brand.id === activeId) ?? brands[0];
  const d = active[lang];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((brand) => [brand.name, brand[lang].shortPos, brand[lang].category].some((x) => x.toLowerCase().includes(q)));
  }, [lang, query]);

  async function copy(text: string, label = "Copied") {
    await navigator.clipboard?.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(brands, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vitanova-brands.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="vmc">
      <style>{styles}</style>
      <aside className="side">
        <div className="mark">V</div>
        <h1>Vitanova<br />Marketing Center</h1>
        <p>Brand OS · V1</p>
        <nav><b>01</b> Brand Library</nav>
      </aside>
      <section className="app">
        <header className="top">
          <div><h2>Brand Library</h2><p>Bilingual marketing rules, prompts, and claim-safe wording</p></div>
          {copied ? <span className="ok">✓ {copied}</span> : null}
          <div className="lang"><button className={lang === "th" ? "on" : ""} onClick={() => setLang("th")}>TH</button><button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button></div>
          <button className="ghost" onClick={exportJson}>Export JSON</button>
        </header>
        <div className="body">
          <aside className="brands">
            <label>Brands<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand" /></label>
            {filtered.map((brand) => (
              <button key={brand.id} className={brand.id === active.id ? "brand active" : "brand"} onClick={() => setActiveId(brand.id)}>
                <span style={{ background: brand.colors[2] }} />
                <strong>{brand.name}</strong>
                <small>{brand[lang].shortPos}</small>
              </button>
            ))}
          </aside>
          <section className="detail">
            <div className="tabs">{(["overview", "voice", "rules", "claim", "prompt"] as Tab[]).map((t) => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
            <div className="panel">
              {tab === "overview" ? <>
                <article className="hero"><div><h3>{active.name}</h3><p>{d.category}</p></div><div className="palette">{active.colors.map((c) => <button key={c} style={{ background: c }} onClick={() => copy(c, c)} title={c} />)}</div><p>{d.positioning}</p><div>{d.channel.map((c) => <span className="pill" key={c}>{c}</span>)}</div></article>
                <div className="grid"><Card title="Positioning" text={d.positioning} onCopy={() => copy(d.positioning)} /><Card title="Audience" text={d.audience} onCopy={() => copy(d.audience)} /><Card title="Voice" text={d.voice} onCopy={() => copy(d.voice)} /><Card title="Visual" text={d.visualStyle} onCopy={() => copy(d.visualStyle)} /></div>
              </> : null}
              {tab === "voice" ? <div className="grid"><Card title="Brand Voice" quote text={d.voice} onCopy={() => copy(d.voice)} /><Card title="Visual Style" quote text={d.visualStyle} onCopy={() => copy(d.visualStyle)} /><Card title="Audience" text={d.audience} onCopy={() => copy(d.audience)} /></div> : null}
              {tab === "rules" ? <div className="grid"><ListCard title="Logo Rules" items={d.logoRules} onCopy={() => copy(d.logoRules.join("\n"))} /><ListCard title="Do" items={d.doList} onCopy={() => copy(d.doList.join("\n"))} /><ListCard title="Don't" items={d.dontList} danger onCopy={() => copy(d.dontList.join("\n"))} /></div> : null}
              {tab === "claim" ? <><div className="grid"><Claim title={lang === "th" ? "คำที่ใช้ได้" : "Safe Wording"} items={d.safeWords} safe copy={copy} /><Claim title={lang === "th" ? "คำที่ต้องหลีกเลี่ยง" : "Risky — Avoid"} items={d.riskyWords} copy={copy} /></div><ListCard title={lang === "th" ? "ตัวอย่างประโยคที่ใช้ได้" : "Safe Examples"} items={d.safeExamples} onCopy={() => copy(d.safeExamples.join("\n"))} /><ListCard title={lang === "th" ? "ตัวอย่างที่ควรแก้" : "Risky Examples"} items={d.riskyExamples} danger onCopy={() => copy(d.riskyExamples.join("\n"))} /></> : null}
              {tab === "prompt" ? <><article className="prompt"><div><b>Brand Prompt Core</b><button onClick={() => copy(buildPrompt(active, lang))}>Copy All</button></div><pre>{buildPrompt(active, lang)}</pre></article><Card title="Prompt Core" text={d.promptCore} onCopy={() => copy(d.promptCore)} /></> : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Card({ title, text, onCopy, quote = false }: { title: string; text: string; onCopy: () => void; quote?: boolean }) {
  return <article className="card"><div><b>{title}</b><button onClick={onCopy}>Copy</button></div><p className={quote ? "quote" : ""}>{text}</p></article>;
}

function ListCard({ title, items, onCopy, danger = false }: { title: string; items: string[]; onCopy: () => void; danger?: boolean }) {
  return <article className={danger ? "card danger" : "card"}><div><b>{title}</b><button onClick={onCopy}>Copy</button></div><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul></article>;
}

function Claim({ title, items, copy, safe = false }: { title: string; items: string[]; copy: (text: string, label?: string) => void; safe?: boolean }) {
  return <article className={safe ? "claim safe" : "claim risky"}><div><b>{title}</b><button onClick={() => copy(items.join(", "))}>Copy All</button></div><div>{items.map((x) => <button key={x} onClick={() => copy(x, x)}>{x}</button>)}</div></article>;
}

const styles = `
*{box-sizing:border-box}body{margin:0;background:#f7f3ec;color:#2a2420;font-family:'DM Sans','Noto Sans Thai',system-ui,sans-serif}.vmc{height:100vh;display:flex;overflow:hidden}.side{width:210px;background:#2a2420;color:#f7f3ec;padding:24px 18px;display:flex;flex-direction:column;gap:18px}.mark{width:34px;height:34px;border-radius:9px;background:#6bbfaa;color:#2a2420;display:grid;place-items:center;font-weight:800}.side h1{font-family:'Instrument Serif',serif;font-size:20px;line-height:1.15;font-weight:400;margin:0}.side p{color:#bfb8b2;font-size:11px;margin:0}.side nav{margin-top:18px;background:#6bbfaa;color:#2a2420;border-radius:8px;padding:9px 10px;font-size:13px}.app{flex:1;display:flex;flex-direction:column;min-width:0}.top{height:66px;border-bottom:1px solid #e3ddd3;display:flex;align-items:center;gap:12px;padding:12px 24px}.top h2{font-family:'Instrument Serif',serif;font-size:22px;margin:0;font-weight:400}.top p{margin:0;color:#9e9088;font-size:12px}.ok{color:#3dad8a;font-size:12px;margin-left:auto}.lang{display:flex;background:#ede8df;border:1px solid #e3ddd3;border-radius:8px;padding:3px}.lang button,.ghost{border:0;border-radius:6px;padding:7px 12px;background:transparent;color:#6b5e56;cursor:pointer}.lang .on,.ghost{background:white;color:#2a2420}.body{flex:1;display:flex;min-height:0}.brands{width:230px;background:#f7f3ec;border-right:1px solid #e3ddd3;padding:14px;overflow:auto}.brands label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#bfb8b2}.brands input{display:block;width:100%;margin:8px 0 12px;border:1px solid #e3ddd3;border-radius:8px;padding:8px;background:white}.brand{width:100%;border:1.5px solid transparent;border-radius:10px;background:transparent;text-align:left;padding:11px;display:grid;grid-template-columns:10px 1fr;gap:2px 8px;cursor:pointer}.brand:hover,.brand.active{background:white}.brand.active{border-color:#c8ede4}.brand span{width:8px;height:8px;border-radius:50%;margin-top:7px}.brand strong{font-size:14px}.brand small{grid-column:2;color:#9e9088}.detail{flex:1;background:#ede8df;display:flex;flex-direction:column;min-width:0}.tabs{display:flex;background:#f7f3ec;border-bottom:1px solid #e3ddd3;padding:0 24px}.tabs button{border:0;background:transparent;padding:14px;color:#9e9088;cursor:pointer;text-transform:capitalize}.tabs .on{color:#6bbfaa;border-bottom:2px solid #6bbfaa}.panel{padding:22px 24px;overflow:auto}.hero,.card,.claim{background:white;border:1px solid #e3ddd3;border-radius:10px;box-shadow:0 1px 3px rgba(42,36,32,.08),0 4px 12px rgba(42,36,32,.04);padding:18px;margin-bottom:12px}.hero h3{font-family:'Instrument Serif',serif;font-size:42px;font-weight:400;margin:0}.hero p{color:#6b5e56}.palette{display:flex;gap:7px;float:right}.palette button{width:36px;height:36px;border-radius:9px;border:1px solid rgba(42,36,32,.15);cursor:pointer}.pill{display:inline-flex;background:#ede8df;border:1px solid #e3ddd3;border-radius:99px;padding:3px 10px;margin:3px;color:#6b5e56}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.card div,.claim div:first-child,.prompt div{display:flex;justify-content:space-between;gap:10px;align-items:center}.card b,.claim b,.prompt b{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#9e9088}.card button,.claim button,.prompt button{border:1px solid #e3ddd3;background:#f7f3ec;border-radius:7px;padding:5px 10px;color:#6b5e56;cursor:pointer}.card p,.card li{color:#6b5e56;line-height:1.7}.quote{font-family:'Instrument Serif','Noto Sans Thai',serif;font-size:24px;font-style:italic}.danger{border-left:3px solid #c4614a}.claim{border-top:3px solid #c4614a}.claim.safe{border-top-color:#3dad8a}.claim div:last-child{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.claim div:last-child button{background:#f5e0db;color:#c4614a}.claim.safe div:last-child button{background:#dcf2eb;color:#3dad8a}.prompt{background:#2a2420;color:#f7f3ec;border-radius:10px;padding:20px;margin-bottom:12px}.prompt pre{white-space:pre-wrap;line-height:1.8;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:14px;color:rgba(247,243,236,.75);font-family:inherit}@media(max-width:900px){.vmc{height:auto;min-height:100vh}.side{display:none}.body{flex-direction:column}.brands{width:100%;max-height:250px}.grid{grid-template-columns:1fr}.top{height:auto;flex-wrap:wrap}.tabs{overflow:auto}.palette{float:none;margin-top:8px}}`;
