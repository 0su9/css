window.addEventListener('DOMContentLoaded', () => {
  // 샘플 영상 ID
  const sampleVideoId = 'ab1ZRyJf9eM';

  // 샘플 주소로 입력창 채우기
  urlInput.value = `https://youtu.be/${sampleVideoId}`;
  widthSelect.value = '70';
  radiusInput.value = '25';
  paddingInput.value = '10';
  bgcolorInput.value = '#ffffff';

  // 자동 태그 생성
  generateTag();
});

const urlInput = document.getElementById('youtubeUrl');
const widthSelect = document.getElementById('maxWidth');
const radiusInput = document.getElementById('radius');
const paddingInput = document.getElementById('padding');
const bgcolorInput = document.getElementById('bgcolor');
const resultBox = document.getElementById('result');
const previewFrame = document.getElementById('previewFrame');

function extractVideoId(url) {
  const shortMatch = url.match(/youtu\.be\/([^\?&]+)/);
  const longMatch = url.match(/v=([^\?&]+)/);
  return shortMatch?.[1] || longMatch?.[1] || '';
}

function generateTag() {
  const rawUrl = urlInput.value.trim();
  const videoId = extractVideoId(rawUrl);
  const maxWidth = widthSelect.value;
  const radius = radiusInput.value;
  const padding = paddingInput.value;
  const bgcolor = bgcolorInput.value;

  if (!videoId) {
    resultBox.value = '⚠️ 유효한 유튜브 주소를 입력해주세요.';
    previewFrame.srcdoc = '';
    return;
  }

  let styleVars = '';
  if (maxWidth !== '70') styleVars += `--maxwidth: ${maxWidth}%; `;
  if (radius !== '25') styleVars += `--radius: ${radius}; `;
  if (padding !== '10') styleVars += `--padding: ${padding}; `;
  if (bgcolor.toLowerCase() !== '#ffffff') styleVars += `--bgcolor: ${bgcolor}; `;

  const styleAttr = styleVars ? ` style="${styleVars.trim()}"` : '';

  const tag = `
<div align="center"><div class="video-wrapper"${styleAttr}>
<iframe src="https://www.youtube.com/embed/?playlist=${videoId}&loop=1&autoplay=1&vq=highres" allow="autoplay" frameborder="0" allowfullscreen></iframe>
</div></div>
<link rel="stylesheet" href="https://0su9.github.io/css/yt_frm_sty.css">
  `.trim();

  resultBox.value = tag;

  const previewHTML = `
    <html>
      <head>
        <link rel="stylesheet" href="https://0su9.github.io/css/yt_frm_sty.css">
      </head>
      <body>
        <div align="center"><div class="video-wrapper"${styleAttr}>
          <iframe src="https://www.youtube.com/embed/?playlist=${videoId}&loop=1&autoplay=1&vq=highres" allow="autoplay" frameborder="0" allowfullscreen></iframe>
        </div></div>
      </body>
    </html>
  `.trim();

  previewFrame.srcdoc = previewHTML;
}

function copyToClipboard() {
  resultBox.select();
  document.execCommand('copy');
  alert('✅ 태그가 복사되었습니다!');
}

urlInput.addEventListener('input', generateTag);
widthSelect.addEventListener('change', generateTag);
radiusInput.addEventListener('input', generateTag);
paddingInput.addEventListener('input', generateTag);

bgcolorInput.addEventListener('input', generateTag);

