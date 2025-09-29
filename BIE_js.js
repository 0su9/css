window.DEFAULT_SETTINGS = {
  // 초기 CSS 설정
  css: `body {
background-image: 
linear-gradient(90deg, #ffffff, #e1fbfc 18%, transparent, transparent),
url('https://archive.org/download/f2_20200103/잠자리_deco.gif'),
url('https://archive.org/download/f2_20200103/꽃잎날리는_effect.gif'),
url('https://archive.org/download/f2_20200103/수박아이_bg.gif');
background-color: #ffffff;
background-attachment: fixed;
background-repeat: no-repeat;
background-position: center, right top -200px, right bottom, right bottom;
background-size: cover, 1000px, 900px 600px, cover;
}`
};

window.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);

  const codeBox = $('codeBox');
  const previewFrame = $('previewFrame');

  const useGradient = $('chkUrl6');
  const angle = $('angle');
  const colorPicker1 = $('colorPicker1');
  const colorText1 = $('colorText1');
  const chkColor1 = $('chkColor1');
  const chkColor2 = $('chkColor2');
  const colorPicker2 = $('colorPicker2');
  const colorText2 = $('colorText2');
  const percentInput = $('percentInput');
  const percentValue = $('percentValue');
  const colorText3 = $('colorText3');
  const colorText4 = $('colorText4');

  const bgColorPicker = $('bgColorPicker');
  const bgColor = $('bgColor');
  const attach = $('attach');
  const repeat = $('repeat');

  const chkBoxes = [$('chkUrl1'), $('chkUrl2'), $('chkUrl3'), $('chkUrl4'), $('chkUrl5')];
  const imgInputs = [$('img1'), $('img2'), $('img3'), $('img4'), $('img5')];
  const posInputs = [$('pos1'), $('pos2'), $('pos3'), $('pos4'), $('pos5')];
  const sizeInputs = [$('size1'), $('size2'), $('size3'), $('size4'), $('size5')];

  const posGradient = $('pos6');
  const sizeGradient = $('size6');

  const chkColor = $('chkColor');
  const chkAttach = $('chkAttach');
  const chkRepeat = $('chkRepeat');
  const resetBtn = $('resetBtn');
  const saveBtn = $('saveBtn');

  percentInput.addEventListener('input', () => {
    percentValue.textContent = percentInput.value + '%';
    generateCSS();
  });

  // 유틸 함수
  function setEnabled(el, enabled) {
    if (!el) return;
    el.style.opacity = enabled ? '1' : '0.4';
    el.style.pointerEvents = enabled ? 'auto' : 'none';
    el.disabled = !enabled;
  }
  function isValidPosition(value) {
    return ['left', 'right', 'top', 'bottom', 'center'].some(k => value.includes(k));
  }
  function isValidSize(value) {
    return ['px', '%', 'em', 'rem', 'vw', 'vh', 'auto', 'cover', 'contain'].some(u => value.includes(u));
  }

  // 색상 동기화
  function bindColorStack(pickerId, textId) {
    const picker = $(pickerId);
    const text = $(textId);
    picker.addEventListener('input', () => text.value = picker.value);
    text.addEventListener('input', () => picker.value = text.value);
    [picker, text].forEach(el => {
      el.addEventListener('input', e => {
        picker.value = text.value = e.target.value;
        generateCSS();
      });
    });
  }
  bindColorStack('colorPicker1', 'colorText1');
  bindColorStack('colorPicker2', 'colorText2');
  bindColorStack('bgColorPicker', 'bgColor');

  // 미리보기
  function updatePreview() {
    const css = codeBox.value || '';
    const html = `
      <html>
        <head>
          <style>
            html, body { margin:0; padding:0; width:100%; height:100%; background: transparent; }
            ${css}
          </style>
        </head>
        <body></body>
      </html>
    `.trim();
    previewFrame.srcdoc = html;
  }
  function applyCheckboxVisuals() {
    // 양방향 연동: 색상 체크 해제 → useGradient 해제
    if (!chkColor1.checked && !chkColor2.checked) {
      useGradient.checked = false;
    }

    // 양방향 연동: useGradient 해제 → 색상 체크 해제
    if (useGradient.checked) {
      if (!chkColor1.checked && !chkColor2.checked) {
        chkColor1.checked = true;
      }
    }

    const gradGroup = document.querySelector('.group-gradient');
    if (gradGroup) {
      gradGroup.style.opacity = useGradient.checked ? '1' : '0.4';
      gradGroup.style.pointerEvents = useGradient.checked ? 'auto' : 'none';
    }
    // 색상-1 체크 해제 시 배경색 대입
    if (useGradient.checked && !chkColor1.checked) {
      colorText1.value = bgColor.value;
    }
    // 색상 입력창: useGradient + 개별 체크 기준
    setEnabled(colorText1, useGradient.checked && chkColor1.checked);
    setEnabled(colorPicker1, useGradient.checked && chkColor1.checked);
    setEnabled(colorText2, useGradient.checked && chkColor2.checked);
    setEnabled(colorPicker2, useGradient.checked && chkColor2.checked);
    // gradient 관련 입력창
    setEnabled(angle, useGradient.checked);
    setEnabled(percentInput, useGradient.checked);
    setEnabled(percentValue, useGradient.checked);
    setEnabled(posGradient, useGradient.checked);
    setEnabled(sizeGradient, useGradient.checked);
    // 이미지 관련 입력창
    imgInputs.forEach((input, i) => setEnabled(input, chkBoxes[i].checked));
    posInputs.forEach((input, i) => setEnabled(input, chkBoxes[i].checked));
    sizeInputs.forEach((input, i) => setEnabled(input, chkBoxes[i].checked));
    // 기타 속성
    setEnabled(bgColor, chkColor.checked);
    setEnabled(bgColorPicker, chkColor.checked);
    setEnabled(attach, chkAttach.checked);
    setEnabled(repeat, chkRepeat.checked);
    // 코드창 및 미리보기 반영
    // generateCSS();
  }

  function generateCSS() {
    const layers = [];

    if (useGradient.checked) {
      let gradient = `linear-gradient(${angle.value},`;
      if (chkColor1.checked) {
        gradient += ` ${colorText1.value.trim()},`;
      } else if (!chkColor2.checked) {
      // 무시
      }
      else {
        // 둘 다 없으면 gradient 생략
        gradient = null;
      }
      if (gradient && chkColor2.checked) {
        gradient += ` ${colorText2.value.trim()} ${percentInput.value}%,`;
      }
      if (gradient) {
        gradient += ` transparent, transparent)`;
        layers.push({ img: gradient, pos: posGradient.value, size: sizeGradient.value });
      }
    }
    // 이미지 레이어들 (역순)
    for (let i = 4; i >= 0; i--) {
      const chk = chkBoxes[i];
      const input = imgInputs[i];
      const pos = posInputs[i];
      const size = sizeInputs[i];

      if (chk.checked && input.value.trim()) {
        layers.push({
          img: `url('${input.value.trim()}')`,
          pos: pos?.value || 'center',
          size: size?.value || 'auto'
        });
      }
    }

    // CSS 속성 조립
    const images = layers.map(l => l.img);
    const positions = layers.map(l => l.pos || 'center');
    const sizes = layers.map(l => l.size || 'auto');

    const lines = ['body {'];
    if (images.length) lines.push(`background-image:\n${images.join(',\n')};`);
    if (chkColor.checked) lines.push(`background-color: ${bgColor.value};`);
    if (chkAttach.checked) lines.push(`background-attachment: ${attach.value};`);
    if (chkRepeat.checked) lines.push(`background-repeat: ${repeat.value};`);
    if (positions.length) lines.push(`background-position: ${positions.join(', ')};`);
    if (sizes.length) lines.push(`background-size: ${sizes.join(', ')};`);
    lines.push('}');
    // 코드창에 삽입 + 미리보기 반영
    codeBox.value = lines.join('\n');
    updatePreview();
  }

  // 입력창에 반영
  function syncInputs() {
    const code = codeBox.value || '';
    applyBackgroundColor(code);
    detectGradientPresence(code);
    if (useGradient.checked) extractGradientValues(code);
    extractBackgroundProperties(code);
    applyCheckboxVisuals();
    updatePreview();
  }

  // 이벤트 연결
  [useGradient, ...chkBoxes, chkColor, chkAttach, chkRepeat, chkColor1, chkColor2].forEach(cb => {
    if (cb) cb.addEventListener('change', applyCheckboxVisuals);
  });

  document.querySelectorAll('input, select').forEach(el => {
    if (el.id !== 'codeBox' && el.type !== 'color' && el.id !== 'percentInput') {
      el.addEventListener('input', generateCSS);
    }
  });

  codeBox.addEventListener('input', syncInputs);

  resetBtn.addEventListener('click', () => {
    codeBox.value = window.DEFAULT_SETTINGS.css;
    syncInputs();
  });

  saveBtn.addEventListener('click', () => {
    const blob = new Blob([codeBox.value || ''], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'background.css';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
  // 배경색 복원
  function applyBackgroundColor(code) {
    const match = code.match(/background-color:\s*([^;]+);/);
    chkColor.checked = !!match;
    if (match) {
      const color = match[1].trim();
      bgColor.value = bgColorPicker.value = color;
    }
  }

  // gradient 존재 여부 판단
  function detectGradientPresence(code) {
    useGradient.checked = code.includes('linear-gradient');
  }

  // ✅ gradient 값 추출
  function extractGradientValues(code) {
    const match = code.match(/linear-gradient\(([^)]+)\)/);
    if (!match) return;

    const parts = match[1].split(',').map(s => s.trim());
    const isFivePart = parts.length === 5;
    const isFourPart = parts.length === 4;

    if (isFivePart) {
      angle.value = parts[0];
      colorText1.value = parts[1];
      chkColor1.checked = !!colorText1.value.trim();

      const color2Part = parts[2];
      const percentMatch = color2Part.match(/(\d+)%/);
      percentInput.value = percentMatch?.[1] || '30';
      percentValue.textContent = percentInput.value + '%';
      colorText2.value = color2Part.replace(/\s*\d+%/, '').trim();
      chkColor2.checked = !!colorText2.value.trim();
    } else if (isFourPart) {
      angle.value = parts[0];
      colorText1.value = bgColor.value;
      chkColor1.checked = false;

      const color2Part = parts[1];
      const percentMatch = color2Part.match(/(\d+)%/);
      percentInput.value = percentMatch?.[1] || '30';
      percentValue.textContent = percentInput.value + '%';
      colorText2.value = color2Part.replace(/\s*\d+%/, '').trim();
      chkColor2.checked = !!colorText2.value.trim();
    } else {
      chkColor1.checked = false;
      chkColor2.checked = false;
      colorText1.value = bgColor.value;
      colorText2.value = '';
    }

    colorPicker1.value = colorText1.value || bgColor.value;
    colorPicker2.value = colorText2.value || '#ffffff';
  }

  // 이미지 및 기타 속성 복원
  function extractBackgroundProperties(code) {
    const bgImgBlock = code.match(/background-image:\s*([^;]+);/);
    let urlValues = [];
    if (bgImgBlock) {
      const raw = bgImgBlock[1];
      const parts = raw.split(/\s*,\s*/).map(s => s.trim());
      const urls = parts.filter(p => /^url\(/i.test(p));
      urlValues = urls.map(u => u.match(/url\((['"]?)(.*?)\1\)/i)?.[2] || '');
    }

    imgInputs.forEach((input, i) => {
      input.value = urlValues[(urlValues.length - 1) - i] || '';
    });

    chkBoxes.forEach((chk, i) => {
      chk.checked = !!imgInputs[i].value.trim();
    });

    const attachMatch = code.match(/background-attachment:\s*([^;]+);/);
    chkAttach.checked = !!attachMatch;
    if (attachMatch) attach.value = attachMatch[1].trim();

    const repeatMatch = code.match(/background-repeat:\s*([^;]+);/);
    chkRepeat.checked = !!repeatMatch;
    if (repeatMatch) repeat.value = repeatMatch[1].trim();

    const posMatch = code.match(/background-position:\s*([^;]+);/);
    if (posMatch) {
      const arr = posMatch[1].split(',').map(s => s.trim());
      posGradient.value = arr[0] || '';
      posInputs.forEach((input, i) => {
        input.value = arr[(arr.length - 1) - i] || '';
      });
    }

    const sizeMatch = code.match(/background-size:\s*([^;]+);/);
    if (sizeMatch) {
      const arr = sizeMatch[1].split(',').map(s => s.trim());
      sizeGradient.value = arr[0] || '';
      sizeInputs.forEach((input, i) => {
        input.value = arr[(arr.length - 1) - i] || '';
      });
    }
  }

  // 초기 구동
  codeBox.value = window.DEFAULT_SETTINGS.css;
  syncInputs();
});
