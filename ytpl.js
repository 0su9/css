const videoIDs = [
  "wGb03U9h0zs","DhXOenuKOgc","4E_Eghv-KoA","Yvg-glcm8TA","1wz5t-6l-Bk","R9IdYlCEc6o",
  "2hBrWfIaG2Q","k7dPVDGp48g","oRpRIoTyYlM","y_A1e1pUgR4","9G9aryIvi-A","2j9l1RSk7yY",
  "tOo6zKtCY4I","BgTK0FhAtok","11WdzWj05LA","V6MNtjpFN2s","mQ3xbfVQ2Kk","CfEplExFB1I",
  "_3DPyvyMskg","P-Rvjjf4qug","XRVLXv3IK9s","JR8ihPu9geA","4kjnd9lTtw4","FB6CTYIgSRA",
  "ll0v_A6dLuk","nba8gVYnm74","KIc8jqjlBl4","yM2gQEb--HU","8RJq6hiDY3w","6hfBv3iB55Y"
];

function clearDefault(input) {
    input.value = "";
}
function extractPlaylist() {
  const playlist = videoIDs.join(',');
  document.getElementById("playlistOutput").value = playlist;
}

function applyEditedIDs() {
  const raw = document.getElementById("playlistOutput").value;
  const ids = raw.split(',').map(id => id.trim()).filter(id => id.length === 11);
  videoIDs.length = 0;
  videoIDs.push(...ids);
  updateCards();
}

function extractVideoID(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function handlePaste(input) {
  const url = input.value.trim();
  const id = extractVideoID(url);
  if (id && !videoIDs.includes(id)) {
    videoIDs.push(id);
    updateCards();
  }
  setTimeout(() => {
    input.value = "";
  }, 300);
}

function updateCards() {
  const box = document.getElementById("playlistBox");
  box.innerHTML = '';

  videoIDs.forEach((id, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-card';
    wrapper.setAttribute('data-id', id);

    const thumb = document.createElement('img');
    thumb.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    thumb.alt = id;
    thumb.className = 'thumbnail';
    thumb.onclick = () => {
      const currentIndex = videoIDs.indexOf(id);
      playPlaylist(currentIndex);
    };

    const label = document.createElement('div');
    label.textContent = id;
    label.className = 'video-label';

    const del = document.createElement('button');
    del.textContent = '❌';
    del.className = 'delete-btn';
    del.onclick = () => {
      videoIDs.splice(index, 1);
      updateCards();
    };

    wrapper.appendChild(thumb);
    wrapper.appendChild(label);
    wrapper.appendChild(del);
    box.appendChild(wrapper);
  });

  new Sortable(playlistBox, {
    animation: 150,
    onEnd: function () {
      const newOrder = Array.from(playlistBox.querySelectorAll('.video-card'))
        .map(card => card.getAttribute('data-id'));
      videoIDs.length = 0;
      videoIDs.push(...newOrder);
    }
  });
}

function playPlaylist(startIndex = 0) {
  if (videoIDs.length === 0) return;

  const playlist = videoIDs.join(',');
  const startID = videoIDs[startIndex];
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${startID}?playlist=${playlist}&autoplay=1&loop=1&vq=highres`;
  iframe.setAttribute('allow', 'autoplay');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('frameborder', '0');
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  const container = document.getElementById('previewContainer');
  container.innerHTML = '';
  container.appendChild(iframe);
}

window.onload = function () {
  updateCards();      // 썸네일 카드 생성
  extractPlaylist();  // 추출창에 반영
  playPlaylist(0);    // 첫 영상부터 자동 재생
};

function saveAsTxt() {
  const content = videoIDs.join(',');

  // 현재 날짜와 시간 가져오기
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 10월 → "10"
  const day = String(now.getDate()).padStart(2, '0');        // 19일 → "19"
  const hour = String(now.getHours()).padStart(2, '0');      // 13시 → "13"
  const minute = String(now.getMinutes()).padStart(2, '0');  // 40분 → "40"

  const filename = `pl-${month}${day}-${hour}${minute}.txt`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
function loadFromTxt(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const ids = text.split(',').map(id => id.trim()).filter(id => id.length === 11);
    videoIDs.length = 0;
    videoIDs.push(...ids);
    updateCards(); // 또는 updateButtons()
    extractPlaylist();
  };
  reader.readAsText(file);
}
