// RGB 색상 선택기 > 복사 기능 추가
function copyHex() {
  const hex = document.getElementById("hexVal").value;
  if (hex) {
    navigator.clipboard.writeText(hex).then(() => {
      alert(`${hex} 복사 완료!`);
    });
  }
}

function SetColor(color) {
  const hex = color.replace("#", "").toUpperCase();
  document.getElementById("TH").value = hex;
  document.getElementById("tt").style.backgroundColor = "#" + hex;
  document.getElementById("TR").value = parseInt(hex.substring(0, 2), 16);
  document.getElementById("TG").value = parseInt(hex.substring(2, 4), 16);
  document.getElementById("TB").value = parseInt(hex.substring(4, 6), 16);
}

function copyColor(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    alert(`${hex} 복사 완료!`);
  });
}

const colorRows = [
  ["#330000", "#331900", "#333300", "#193300", "#003300", "#003319", "#003333", "#001933", "#000033", "#190033", "#330033", "#330019", "#000000"],
  ["#660000", "#663300", "#666600", "#336600", "#006600", "#006633", "#006666", "#003366", "#000066", "#330066", "#660066", "#660033", "#202020"],
  ["#990000", "#994C00", "#999900", "#4C9900", "#009900", "#00994C", "#009999", "#004C99", "#000099", "#4C0099", "#990099", "#99004C", "#404040"],
  ["#CC0000", "#CC6600", "#CCCC00", "#66CC00", "#00CC00", "#00CC66", "#00CCCC", "#0066CC", "#0000CC", "#6600CC", "#CC00CC", "#CC0066", "#606060"],
  ["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#7F00FF", "#FF00FF", "#FF007F", "#808080"],
  ["#FF3333", "#FF9933", "#FFFF33", "#99FF33", "#33FF33", "#33FF99", "#33FFFF", "#3399FF", "#3333FF", "#9933FF", "#FF33FF", "#FF3399", "#A0A0A0"],
  ["#FF6666", "#FFB266", "#FFFF66", "#B2FF66", "#66FF66", "#66FFB2", "#66FFFF", "#66B2FF", "#6666FF", "#B266FF", "#FF66FF", "#FF66B2", "#C0C0C0"],
  ["#FF9999", "#FFCC99", "#FFFF99", "#CCFF99", "#99FF99", "#99FFCC", "#99FFFF", "#99CCFF", "#9999FF", "#CC99FF", "#FF99FF", "#FF99CC", "#E0E0E0"],
  ["#FFCCCC", "#FFE5CC", "#FFFFCC", "#E5FFCC", "#CCFFCC", "#CCFFE5", "#CCFFFF", "#CCE5FF", "#CCCCFF", "#E5CCFF", "#FFCCFF", "#FFCCE5", "#FFFFFF"]
];

const table = document.getElementById("color-table");
colorRows.forEach(row => {
  const tr = document.createElement("tr");
  row.forEach(hex => {
    const td = document.createElement("td");
    td.style.background = hex;
    td.innerHTML = "&nbsp;";
    td.onmouseover = () => SetColor(hex);
    td.ondblclick = () => copyColor(hex);
    tr.appendChild(td);
  });
  table.appendChild(tr);
});

// 색상 선택기 관련 코드
const colorBox = document.getElementById("colorBox");
const hueBar = document.getElementById("hueBar");
const colorHandle = document.getElementById("colorHandle");
const hueHandle = document.getElementById("hueHandle");
const ctxBox = colorBox.getContext("2d");
const ctxHue = hueBar.getContext("2d");

const rVal = document.getElementById("rVal");
const gVal = document.getElementById("gVal");
const bVal = document.getElementById("bVal");
const hVal = document.getElementById("hVal");
const sVal = document.getElementById("sVal");
const vVal = document.getElementById("vVal");
const hexVal = document.getElementById("hexVal");
const preview = document.getElementById("preview");

let hue = 205;
let selectedX = 100;
let selectedY = 100;
let isDragging = false;
let isHueDragging = false;

function drawHueBar() {
  const gradient = ctxHue.createLinearGradient(0, 0, 0, hueBar.height);
  for (let i = 0; i <= 360; i += 60) {
    gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
  }
  ctxHue.fillStyle = gradient;
  ctxHue.fillRect(0, 0, hueBar.width, hueBar.height);
}

function drawColorBox(h) {
  const satGradient = ctxBox.createLinearGradient(0, 0, colorBox.width, 0);
  satGradient.addColorStop(0, "white");
  satGradient.addColorStop(1, `hsl(${h}, 100%, 50%)`);
  ctxBox.fillStyle = satGradient;
  ctxBox.fillRect(0, 0, colorBox.width, colorBox.height);

  const valGradient = ctxBox.createLinearGradient(0, 0, 0, colorBox.height);
  valGradient.addColorStop(0, "rgba(255,255,255,0)");
  valGradient.addColorStop(1, "rgba(0,0,0,1)");
  ctxBox.fillStyle = valGradient;
  ctxBox.fillRect(0, 0, colorBox.width, colorBox.height);
}

function updateColorAt(x, y) {
  selectedX = x;
  selectedY = y;
  const pixel = ctxBox.getImageData(x, y, 1, 1).data;
  const [r, g, b] = pixel;
  const hex = rgbToHex(r, g, b);
  rVal.value = r;
  gVal.value = g;
  bVal.value = b;
  hexVal.value = hex;
  preview.style.backgroundColor = hex;

  const hsv = rgbToHsv(r, g, b);
  hVal.value = Math.round(hsv[0]);
  sVal.value = Math.round(hsv[1] * 100);
  vVal.value = Math.round(hsv[2] * 100);

  drawColorBox(hue);
  colorHandle.style.left = `${x - 6}px`;
  colorHandle.style.top = `${y - 6}px`;
}

function updateHue(y) {
  hue = Math.round((y / hueBar.height) * 360);
  hVal.value = hue;
  hueHandle.style.top = `${y - 2}px`;
  drawColorBox(hue);
  updateColorAt(selectedX, selectedY);
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, v];
}

drawHueBar();
drawColorBox(hue);
updateColorAt(selectedX, selectedY);
hueHandle.style.top = `${(hue / 360) * hueBar.height - 2}px`;
colorHandle.style.left = `${selectedX - 6}px`;
colorHandle.style.top = `${selectedY - 6}px`;

hueBar.addEventListener("click", e => updateHue(e.offsetY));
hueBar.addEventListener("mousedown", e => {
  isHueDragging = true;
  updateHue(e.offsetY);
});

document.addEventListener("mousemove", e => {
  if (isDragging) {
    colorHandle.style.transition = "none";
    const rect = colorBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateColorAt(Math.max(0, Math.min(colorBox.width, x)), Math.max(0, Math.min(colorBox.height, y)));
  }
  if (isHueDragging) {
    hueHandle.style.transition = "none";
    const rect = hueBar.getBoundingClientRect();
    const y = e.clientY - rect.top;
    updateHue(Math.max(0, Math.min(hueBar.height, y)));
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  isHueDragging = false;
  colorHandle.style.transition = "left 0.2s ease-out, top 0.2s ease-out";
  hueHandle.style.transition = "top 0.2s ease-out";
});

colorBox.addEventListener("mousedown", e => {
  isDragging = true;
  updateColorAt(e.offsetX, e.offsetY);
});

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

// RGB 색상 표 테이블 생성
const allColors = [
  { name: "Black (검정)", hex: "#000000", rgb: [0, 0, 0] },
  { name: "White (하얀)", hex: "#FFFFFF", rgb: [255, 255, 255] },
  { name: "Red (빨강)", hex: "#FF0000", rgb: [255, 0, 0] },
  { name: "DarkRed (진한 빨간색)", hex: "#8B0000", rgb: [139, 0, 0] },
  { name: "FireBrick (내화 벽돌)", hex: "#B22222", rgb: [178, 34, 34] },
  { name: "Crimson (진홍)", hex: "#DC143C", rgb: [220, 20, 60] },
  { name: "Tomato (토마토)", hex: "#FF6347", rgb: [255, 99, 71] },
  { name: "Coral (산호)", hex: "#FF7F50", rgb: [255, 127, 80] },
  { name: "IndianRed (인디언 레드)", hex: "#CD5C5C", rgb: [205, 92, 92] },
  { name: "Salmon (연어)", hex: "#FA8072", rgb: [250, 128, 114] },
  { name: "LightSalmon (가벼운 연어)", hex: "#FFA07A", rgb: [255, 160, 122] },
  { name: "OrangeRed (오렌지 레드)", hex: "#FF4500", rgb: [255, 69, 0] },
  { name: "Orange (주황색)", hex: "#FFA500", rgb: [255, 165, 0] },
  { name: "Gold (금)", hex: "#FFD700", rgb: [255, 215, 0] },
  { name: "DarkGoldenRod (진한 황금 막대)", hex: "#B8860B", rgb: [184, 134, 11] },
  { name: "GoldenRod (황금 막대)", hex: "#DAA520", rgb: [218, 165, 32] },
  { name: "PaleGoldenRod (창백한 황금 막대)", hex: "#EEE8AA", rgb: [238, 232, 170] },
  { name: "Khaki (카키색 옷감)", hex: "#F0E68C", rgb: [240, 230, 140] },
  { name: "Yellow (노랑)", hex: "#FFFF00", rgb: [255, 255, 0] },
  { name: "LightYellow (연노랑)", hex: "#FFFFE0", rgb: [255, 255, 224] },
  { name: "Lime (라임)", hex: "#00FF00", rgb: [0, 255, 0] },
  { name: "LimeGreen (라임 그린)", hex: "#32CD32", rgb: [50, 205, 50] },
  { name: "LightGreen (연한 초록색)", hex: "#90EE90", rgb: [144, 238, 144] },
  { name: "PaleGreen (옅은 녹색)", hex: "#98FB98", rgb: [152, 251, 152] },
  { name: "SpringGreen (봄 녹색)", hex: "#00FF7F", rgb: [0, 255, 127] },
  { name: "SeaGreen (바다 녹색)", hex: "#2E8B57", rgb: [46, 139, 87] },
  { name: "MediumSeaGreen (중간 바다 녹색)", hex: "#3CB371", rgb: [60, 179, 113] },
  { name: "DarkSeaGreen (어두운 바다 녹색)", hex: "#8FBC8F", rgb: [143, 188, 143] },
  { name: "Aqua (청록색)", hex: "#00FFFF", rgb: [0, 255, 255] },
  { name: "Turquoise (터키 옥)", hex: "#40E0D0", rgb: [64, 224, 208] },
  { name: "MediumTurquoise (중간 청록색)", hex: "#48D1CC", rgb: [72, 209, 204] },
  { name: "PaleTurquoise (창백한 청록색)", hex: "#AFEEEE", rgb: [175, 238, 238] },
  { name: "Aquamarine (아쿠아 마린)", hex: "#7FFFD4", rgb: [127, 255, 212] },
  { name: "Blue (푸른)", hex: "#0000FF", rgb: [0, 0, 255] },
  { name: "RoyalBlue (로얄 블루)", hex: "#4169E1", rgb: [65, 105, 225] },
  { name: "DodgerBlue (다저 블루)", hex: "#1E90FF", rgb: [30, 144, 255] },
  { name: "SkyBlue (하늘색)", hex: "#87CEEB", rgb: [135, 206, 235] },
  { name: "LightSkyBlue (연한 하늘색)", hex: "#87CEFA", rgb: [135, 206, 250] },
  { name: "MidnightBlue (자정 블루)", hex: "#191970", rgb: [25, 25, 112] },
  { name: "Navy (해군)", hex: "#000080", rgb: [0, 0, 128] },
  { name: "DarkBlue (진한 파란색)", hex: "#00008B", rgb: [0, 0, 139] },
  { name: "MediumBlue (미디엄 블루)", hex: "#0000CD", rgb: [0, 0, 205] },
  { name: "Purple (보라색)", hex: "#800080", rgb: [128, 0, 128] },
  { name: "MediumPurple (중간 보라색)", hex: "#9370DB", rgb: [147, 112, 219] },
  { name: "DarkMagenta (진한 자홍색)", hex: "#8B008B", rgb: [139, 0, 139] },
  { name: "Magenta (자홍색)", hex: "#FF00FF", rgb: [255, 0, 255] },
  { name: "HotPink (핫 핑크)", hex: "#FF69B4", rgb: [255, 105, 180] },
  { name: "Pink (분홍)", hex: "#FFC0CB", rgb: [255, 192, 203] },
  { name: "Beige (베이지)", hex: "#F5F5DC", rgb: [245, 245, 220] },
  { name: "Bisque (비스크)", hex: "#FFE4C4", rgb: [255, 228, 196] },
  { name: "Wheat (밀)", hex: "#F5DEB3", rgb: [245, 222, 179] },
  { name: "Cornsilk (옥수수 실크)", hex: "#FFF8DC", rgb: [255, 248, 220] },
  { name: "LemonChiffon (레몬 쉬폰)", hex: "#FFFACD", rgb: [255, 250, 205] },
  { name: "AntiqueWhite (앤티크 화이트)", hex: "#FAEBD7", rgb: [250, 235, 215] },
  { name: "Snow (눈)", hex: "#FFFAFA", rgb: [255, 250, 250] },
  { name: "Ivory (상아)", hex: "#FFFFF0", rgb: [255, 255, 240] },
  { name: "GhostWhite (고스트 화이트)", hex: "#F8F8FF", rgb: [248, 248, 255] },
  { name: "Gainsboro (Gainsboro)", hex: "#DCDCDC", rgb: [220, 220, 220] },
  { name: "Silver (은)", hex: "#C0C0C0", rgb: [192, 192, 192] },
  { name: "Gray (회색)", hex: "#808080", rgb: [128, 128, 128] },
  { name: "DarkGray (진한 회색)", hex: "#A9A9A9", rgb: [169, 169, 169] },
  { name: "DimGray (희미한 회색)", hex: "#696969", rgb: [105, 105, 105] },
  { name: "LightGray (밝은 회색)", hex: "#D3D3D3", rgb: [211, 211, 211] },
  { name: "SlateGray (슬레이트 그레이)", hex: "#708090", rgb: [112, 128, 144] },
  { name: "LightSlateGray (라이트 슬레이트 그레이)", hex: "#778899", rgb: [119, 136, 153] },
  { name: "LightSteelBlue (라이트 스틸 블루)", hex: "#B0C4DE", rgb: [176, 196, 222] },
  { name: "Lavender (라벤더)", hex: "#E6E6FA", rgb: [230, 230, 250] },
  { name: "FloralWhite (플로럴 화이트)", hex: "#FFFAF0", rgb: [255, 250, 240] },
  { name: "AliceBlue (앨리스 블루)", hex: "#F0F8FF", rgb: [240, 248, 255] },
  { name: "GhostWhite (고스트 화이트)", hex: "#F8F8FF", rgb: [248, 248, 255] },
  { name: "Honeydew (단물)", hex: "#F0FFF0", rgb: [240, 255, 240] },
  { name: "Ivory (상아)", hex: "#FFFFF0", rgb: [255, 255, 240] },
  { name: "Azure (하늘빛)", hex: "#F0FFFF", rgb: [240, 255, 255] },
  { name: "OldLace (오래된 레이스)", hex: "#FDF5E6", rgb: [253, 245, 230] },
  { name: "PapayaWhip (파파야 채찍)", hex: "#FFEFD5", rgb: [255, 239, 213] },
  { name: "Seashell (바다 조개)", hex: "#FFF5EE", rgb: [255, 245, 238] },
  { name: "MintCream (민트 크림)", hex: "#F5FFFA", rgb: [245, 255, 250] },
  { name: "Moccasin (모카신)", hex: "#FFE4B5", rgb: [255, 228, 181] },
  { name: "NavajoWhite (나바호 어 화이트)", hex: "#FFDEAD", rgb: [255, 222, 173] },
  { name: "PeachPuff (복숭아 퍼프)", hex: "#FFDAB9", rgb: [255, 218, 185] },
  { name: "MistyRose (안개가 자욱한 장미)", hex: "#FFE4E1", rgb: [255, 228, 225] },
  { name: "LavenderBlush (라벤더 블러쉬)", hex: "#FFF0F5", rgb: [255, 240, 245] },
  { name: "Linen (리넨)", hex: "#FAF0E6", rgb: [250, 240, 230] },
  { name: "Sienna (시에나)", hex: "#A0522D", rgb: [160, 82, 45] },
  { name: "Chocolate (초콜릿)", hex: "#D2691E", rgb: [210, 105, 30] },
  { name: "Peru (페루)", hex: "#CD853F", rgb: [205, 133, 63] },
  { name: "SandyBrown (샌디 브라운)", hex: "#F4A460", rgb: [244, 164, 96] },
  { name: "BurlyWood (건장한 나무)", hex: "#DEB887", rgb: [222, 184, 135] },
  { name: "Tan (황갈색)", hex: "#D2B48C", rgb: [210, 180, 140] },
  { name: "RosyBrown (장미 빛 갈색)", hex: "#BC8F8F", rgb: [188, 143, 143] }
];

const tbody = document.querySelector("#extendedColorTable tbody");

allColors.forEach(({ name, hex, rgb }) => {
  const tr = document.createElement("tr");

  const tdColor = document.createElement("td");
  tdColor.style.background = hex;
  tdColor.innerHTML = "&nbsp;";
  tr.appendChild(tdColor);

  const tdName = document.createElement("td");
  tdName.textContent = name;
  tr.appendChild(tdName);

  const tdHex = document.createElement("td");
  tdHex.className = "color-copyable";
  tdHex.textContent = hex;
  tdHex.onclick = () => {
    navigator.clipboard.writeText(hex).then(() => {
      alert(`${hex} 복사 완료!`);
    });
  };
  tr.appendChild(tdHex);

  const tdRGB = document.createElement("td");
  tdRGB.textContent = `(${rgb.join(", ")})`;
  tr.appendChild(tdRGB);

  tbody.appendChild(tr);
});