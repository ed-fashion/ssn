// ============================================
// SSN — player.js  |  Módulo 3: Player Global
// ============================================

const SSNPlayer = (() => {
  let audio = new Audio();
  let currentId = null;
  let playing = false;

  const playerEl     = document.getElementById('global-player');
  const playBtn      = document.getElementById('playerPlayBtn');
  const playIcon     = document.getElementById('playerPlayIcon');
  const tituloEl     = document.getElementById('playerTitulo');
  const artistaEl    = document.getElementById('playerArtista');
  const timeEl       = document.getElementById('playerTime');
  const durationEl   = document.getElementById('playerDuration');
  const barFill      = document.getElementById('playerBarFill');
  const barEl        = document.getElementById('playerBar');

  // Ícones SVG
  const ICON_PLAY  = `<polygon points="5,3 19,12 5,21"/>`;
  const ICON_PAUSE = `<rect x="6" y="3" width="4" height="18"/><rect x="14" y="3" width="4" height="18"/>`;

  // ── Progresso ──────────────────────────────
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    barFill.style.width = pct + '%';
    timeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    setButtonState(false);
    playing = false;
    resetCardBtn(currentId);
  });

  // ── Clique na barra ─────────────────────────
  barEl.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = barEl.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // ── Play/Pause global ───────────────────────
  playBtn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      playing = false;
      setButtonState(false);
      updateCardBtn(currentId, false);
    } else {
      audio.play();
      playing = true;
      setButtonState(true);
      updateCardBtn(currentId, true);
    }
  });

  // ── API pública ─────────────────────────────
  function toggle(id, url, titulo, artista) {
    // mesma música — pause/resume
    if (currentId === id) {
      if (playing) {
        audio.pause();
        playing = false;
        setButtonState(false);
        updateCardBtn(id, false);
      } else {
        audio.play();
        playing = true;
        setButtonState(true);
        updateCardBtn(id, true);
      }
      return;
    }

    // música diferente — parar a anterior
    if (currentId !== null) resetCardBtn(currentId);
    audio.pause();

    // carregar nova
    currentId = id;
    audio.src = url;
    audio.load();
    audio.play().catch(() => alert('Não foi possível reproduzir o preview.'));
    playing = true;

    // actualizar UI
    tituloEl.textContent = titulo;
    artistaEl.textContent = artista;
    playerEl.classList.add('visible');
    setButtonState(true);
    updateCardBtn(id, true);
  }

  // ── Helpers visuais ─────────────────────────
  function setButtonState(isPlaying) {
    playIcon.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
  }

  function updateCardBtn(id, isPlaying) {
    const btn = document.getElementById(`btnPreview-${id}`);
    if (!btn) return;
    if (isPlaying) {
      btn.classList.add('playing');
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="3" width="4" height="18"/><rect x="14" y="3" width="4" height="18"/></svg> PAUSA`;
    } else {
      btn.classList.remove('playing');
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> OUVIR`;
    }
  }

  function resetCardBtn(id) {
    const btn = document.getElementById(`btnPreview-${id}`);
    if (!btn) return;
    btn.classList.remove('playing');
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> OUVIR`;
  }

  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  return { toggle };
})();
