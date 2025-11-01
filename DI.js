// 1️⃣ 디코딩 / 인코딩
function decodeURL() {
  let input = document.getElementById("input").value.trim();
  document.getElementById("output").value = decodeURIComponent(input);
}
function encodeURL() {
  let input = document.getElementById("input").value.trim();
  document.getElementById("output").value = encodeURIComponent(input);
}
// 🎯 DOM 요소 캐싱
const el = {
  linkInput: document.getElementById('linkInput'),
  effectUrl: document.getElementById('effectUrl'),
  bgUrl: document.getElementById('bgUrl'),
  r: document.getElementById('r'),
  g: document.getElementById('g'),
  b: document.getElementById('b'),
  customizer: document.getElementById('customizer'),
  showCustomizerBtn: document.getElementById('showCustomizerBtn'),
  exportBox: document.getElementById('exportBox'),
  importBox: document.getElementById('importBox')
};

// 🧠 공통 설정값 가져오기
function getCurrentSettings() {
  return {
    effectUrl: el.effectUrl.value.trim(),
    bgUrl: el.bgUrl.value.trim(),
    r: el.r.value,
    g: el.g.value,
    b: el.b.value
  };
}

// ⏰ 알림문자 페이드
function showMessage(targetId, text, duration = 3000) {
  const box = document.getElementById(targetId);
  if (!box) return;

  box.textContent = text;
   box.style.textAlign = "left"; // ✅ 좌측 정렬 적용
  box.style.opacity = "1";

  setTimeout(() => {
    box.style.opacity = "0";
    setTimeout(() => {
      box.textContent = "";
    }, 500); // fade-out 후 텍스트 제거
  }, duration);
}

// 🎨 배경 이미지 설정
function setBackgroundImages(effectUrl, bgUrl) {
  const bgImages = [];
  if (effectUrl) bgImages.push(`url('${effectUrl}')`);
  if (bgUrl) bgImages.push(`url('${bgUrl}')`);
  document.body.style.backgroundImage = bgImages.join(", ");
}

// 🎨 카드 색상 적용
function updateColor() {
  const { r, g, b } = getCurrentSettings();
  const color = `rgba(${r}, ${g}, ${b}, 0.85)`;
  document.querySelectorAll(".card").forEach(card => {
    card.style.backgroundColor = color;
  });
}

// 🧩 스타일 적용
function applyCustomStyle() {
  const { effectUrl, bgUrl } = getCurrentSettings();
  setBackgroundImages(effectUrl, bgUrl);
  updateColor();
  el.customizer.classList.add("hidden");
  el.showCustomizerBtn.classList.remove("hidden");
}

// 🔄 설정 초기화
function resetSettings() {
  localStorage.removeItem("customSettings");

  const defaults = window.DEFAULT_SETTINGS;
  el.effectUrl.value = defaults.effectUrl;
  el.bgUrl.value = defaults.bgUrl;
  el.r.value = defaults.r;
  el.g.value = defaults.g;
  el.b.value = defaults.b;

  applyCustomStyle();
  showMessage("mainMessage", "✅ 설정이 초기화 되었습니다!");
}

// 📤 설정 내보내기
function exportSettings() {
  const { effectUrl, bgUrl, r, g, b } = getCurrentSettings();
  el.exportBox.value = `${effectUrl}\n${bgUrl}\nRGB(${r}, ${g}, ${b})`;
}

// 📥 설정 불러오기
function importSettings() {
  const input = el.importBox.value.trim().split("\n");
  if (input.length !== 3 || !input[2].startsWith("RGB(")) {
    showMessage("customizerMessage","❎ 형식이 올바르지 않아요 😢\n3줄 입력 + RGB 형식이 필요합니다.");
    return;
  }

  const rgbMatch = input[2].match(/RGB\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!rgbMatch) {
    showMessage("customizerMessage","❎ RGB 형식이 잘못되었습니다.");
    return;
  }

  el.effectUrl.value = input[0].trim();
  el.bgUrl.value = input[1].trim();
  el.r.value = rgbMatch[1];
  el.g.value = rgbMatch[2];
  el.b.value = rgbMatch[3];
  applyCustomStyle();
  showMessage("mainMessage", "✅ 설정이 적용되었습니다!");
}

// ⚙️ 설정창 열기
function showCustomizer() {
  el.customizer.classList.remove("hidden");
  el.showCustomizerBtn.classList.add("hidden");
}

// ❎ 설정창 닫기
function closeCustomizer() {
  el.customizer.classList.add("hidden");
  el.showCustomizerBtn.classList.remove("hidden");
  showMessage("mainMessage", "❎ 설정창을 닫았습니다.");
}

// 🚀 초기 설정 로딩
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("customSettings");
  const settings = saved ? JSON.parse(saved) : window.DEFAULT_SETTINGS;

  el.effectUrl.value = settings.effectUrl;
  el.bgUrl.value = settings.bgUrl;
  el.r.value = settings.r;
  el.g.value = settings.g;
  el.b.value = settings.b;

  setBackgroundImages(settings.effectUrl, settings.bgUrl);
  updateColor();
});