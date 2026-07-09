// ============================================
// SSN — app.js  |  Módulo 2 + ligação Supabase
// ============================================

const { createClient } = supabase;
const db = createClient(SSN_CONFIG.supabaseUrl, SSN_CONFIG.supabaseKey);

// ── ESTADO ──────────────────────────────────
let todasMusicas = [];
let estilosUnicos = new Set();

// ── INIT ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  carregarMusicas();
  carregarTop5();
});

// ── CARREGAR MÚSICAS ────────────────────────
async function carregarMusicas(estilo = '') {
  const grid = document.getElementById('musicGrid');
  grid.innerHTML = '<div class="grid-loading">A CARREGAR FAIXAS</div>';

  let query = db.from('musicas').select('*').eq('ativo', true).order('data_publicacao', { ascending: false });
  if (estilo) query = query.eq('estilo_musical', estilo);

  const { data, error } = await query;

  if (error || !data) {
    grid.innerHTML = '<div class="grid-empty">Erro ao carregar músicas.<br/>Tenta mais tarde.</div>';
    return;
  }

  todasMusicas = data;

  // colecionar estilos únicos para os filtros
  data.forEach(m => { if (m.estilo_musical) estilosUnicos.add(m.estilo_musical); });
  renderFiltros();

  if (data.length === 0) {
    grid.innerHTML = '<div class="grid-empty">Nenhuma faixa publicada ainda.</div>';
    return;
  }

  grid.innerHTML = data.map(m => criarCard(m)).join('');
}

// ── CRIAR CARD ──────────────────────────────
function criarCard(m) {
  const capa = m.link_capa
    ? `<img class="card-cover" src="${m.link_capa}" alt="${m.titulo}" loading="lazy" onerror="this.outerHTML='<div class=\\'card-cover-placeholder\\'>${iconeCapa()}</div>'">`
    : `<div class="card-cover-placeholder">${iconeCapa()}</div>`;

  const estilo = m.estilo_musical
    ? `<div class="card-estilo">${m.estilo_musical}</div>`
    : '';

  return `
    <div class="card" data-id="${m.id}">
      <div class="card-glow"></div>
      ${capa}
      <div class="card-body">
        ${estilo}
        <div class="card-titulo" title="${m.titulo}">${m.titulo}</div>
        <div class="card-artista">${m.artista}</div>
        <div class="card-actions">
          <button class="btn-preview" onclick="togglePreview(${m.id}, '${escapar(m.link_demo)}', '${escapar(m.titulo)}', '${escapar(m.artista)}')" id="btnPreview-${m.id}">
            ${iconePlay()} OUVIR
          </button>
          <a class="btn-download" href="download.html?id=${m.id}" target="_blank">
            ${iconeDownload()} DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  `;
}

// ── FILTROS ─────────────────────────────────
function renderFiltros() {
  const container = document.getElementById('filtros');
  const extra = Array.from(estilosUnicos).map(e =>
    `<button class="filter-btn" data-estilo="${e}" onclick="filtrar(this)">${e.toUpperCase()}</button>`
  ).join('');
  // preserva o botão TUDO, adiciona os estilos
  container.innerHTML = `<button class="filter-btn active" data-estilo="" onclick="filtrar(this)">TUDO</button>${extra}`;
}

function filtrar(btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  carregarMusicas(btn.dataset.estilo);
}

// ── TOP 5 ────────────────────────────────────
async function carregarTop5() {
  const { data, error } = await db.from('top5_semanal').select('*');
  const lista = document.getElementById('top5List');

  if (error || !data || data.length === 0) {
    lista.innerHTML = '<div style="color:var(--text-dim);font-size:0.75rem;">Sem dados ainda.</div>';
    return;
  }

  const max = data[0].total_downloads || 1;

  lista.innerHTML = data.map((m, i) => {
    const pct = Math.max(15, Math.round((m.total_downloads / max) * 100));
    return `
      <div class="top5-item">
        <div class="top5-rank">${i + 1}</div>
        <div class="top5-info">
          <div class="top5-titulo">${m.titulo}</div>
          <div class="top5-artista">${m.artista}</div>
        </div>
        <div class="top5-bar-wrap">
          <div class="top5-bar" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ── PREVIEW ─────────────────────────────────
function togglePreview(id, url, titulo, artista) {
  if (!url || url === 'null' || url === '') {
    alert('Preview não disponível para esta faixa.');
    return;
  }
  SSNPlayer.toggle(id, url, titulo, artista);
}

// ── HELPERS ─────────────────────────────────
function escapar(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function iconeCapa() {
  return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7fc2" stroke-width="1">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
  </svg>`;
}

function iconePlay() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
}

function iconeDownload() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M12 3v13M7 11l5 5 5-5"/><path d="M5 20h14"/>
  </svg>`;
}
