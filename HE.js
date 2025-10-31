const textarea = document.getElementById("code");
const preview = document.getElementById("preview");
const slider = document.getElementById("ratioSlider");
const label = document.getElementById("ratioLabel");
const selectedColor = document.getElementById("selectedColor");

textarea.addEventListener("input", () => {
  preview.srcdoc = textarea.value;
});

slider.addEventListener("input", () => {
  const ratio = slider.value / 100;
  label.textContent = `${slider.value}%`;
  document.querySelector(".preview").style.flex = ratio;
  document.querySelector(".editor").style.flex = 1 - ratio;
});

function viewResult() {
  preview.srcdoc = textarea.value;
}

function copyCode() {
  textarea.select();
  document.execCommand("copy");
  alert("복사 완료!");
}

function clearPreview() {
  preview.srcdoc = "";
}

function clearCode() {
  textarea.value = "";
  preview.srcdoc = "";
}

function reset() {
  textarea.value = "<h1 style='color: #4a90e2;'>Hello, 하늘소!</h1>";
  preview.srcdoc = textarea.value;
}

function insertColor(hex) {
  selectedColor.textContent = hex;
}

function copySelectedColor() {
  const hex = selectedColor.textContent;
  if (hex !== "색상코드 없음") {
    navigator.clipboard.writeText(hex).then(() => {
      alert(`${hex} 복사 완료!`);
    });
  }
}
function downloadCodeAsFile() {
  const css = textarea.value.trim();
  if (!css) {
    showToast("⚠️ 저장할 코드가 없습니다!");
    return;
  }
      // ✅ 현재 날짜와 시간 가져오기
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // 월 (2자리)
  const dd = String(now.getDate()).padStart(2, "0");      // 일 (2자리)
  const hh = String(now.getHours()).padStart(2, "0");     // 시 (2자리)
  const min = String(now.getMinutes()).padStart(2, "0");  // 분 (2자리)
  const timestamp = `${mm}${dd}_${hh}${min}`; // 예: 0909_0643

  // ✅ 드롭다운에서 선택한 확장자 가져오기
  const fileType = document.getElementById("fileType").value;
  const filename = `html_${timestamp}.${fileType}`; // ✅ 저장될 파일 이름

  // ✅ BOM (\uFEFF) 붙이기
  const bom = "\uFEFF";
  const mimeType = fileType === "html" ? "text/html" : "text/plain";
  const blob = new Blob([bom + css], { type: `${mimeType};charset=utf-8` });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // <-- 동적으로 생성된 파일명
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  //textarea.value = ""; // 저장 후 코드창 비우기
  showToast(`✅ 코드가 (${filename}) 파일로 저장되었습니다!`);
}
function showToast(message, duration = 2000) {
  const toast = document.createElement("div");
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    background: "#4a90e2",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    zIndex: "9999",
    opacity: "0",
    transition: "opacity 0.3s ease"
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

reset();
textarea.value = ""; // 바로 붙여넣게 코드창 비움