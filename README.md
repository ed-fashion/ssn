# Som Sem Nome — Site de Música

Stack: HTML/CSS/JS vanilla + Supabase + GitHub Pages

---

## Estrutura de ficheiros

```
/
├── index.html          ← Página principal
├── download.html       ← Página intermédia de download
├── assets/
│   ├── logo.png        ← ssn_logo_quadrado_v2.png  (renomeia)
│   └── favicon.png     ← ssn_logo_quadrado_sigla.png (renomeia)
└── js/
    ├── config.js       ← URL e chave Supabase (já preenchido)
    ├── app.js          ← Lógica principal
    └── player.js       ← Player de áudio global
```

---

## Deploy no GitHub Pages

1. Cria um repositório no GitHub (ex: `somsemnome`)
2. Carrega todos estes ficheiros para o repositório
3. Vai a **Settings → Pages**
4. Em "Source" escolhe **Deploy from a branch**
5. Branch: `main` / Folder: `/ (root)`
6. Guarda — o site fica em `https://teu-user.github.io/somsemnome`

---

## Adicionar logos

Na pasta `assets/`:
- Renomeia `ssn_logo_quadrado_v2.png` para **`logo.png`**
- Renomeia `ssn_logo_quadrado_sigla.png` para **`favicon.png`**

---

## Adicionar músicas (Supabase)

1. Vai ao painel Supabase → **Table Editor → musicas**
2. Clica **Insert row**
3. Preenche os campos:
   - `titulo` — nome da música
   - `artista` — nome do artista
   - `estilo_musical` — ex: Dark Trap, Afrobeats
   - `link_capa` — URL da imagem (Google Drive, Imgur, etc.)
   - `link_demo` — URL do ficheiro de áudio para preview
   - `link_download` — URL do Mediafire / Mega / Drive
   - `ativo` — TRUE para publicar

---

## Monetização (download)

O botão "Download" na página principal leva para `download.html?id=ID`.
Essa página mostra um contador de 10 segundos com espaço publicitário.
Quando o contador termina, aparece o botão real com o link de download.

Para monetizar o espaço publicitário, substitui o bloco `.ad-zone` pelo
código de anúncio (Google AdSense, anúncio local, etc.).

Para monetizar por clique no link de download, substitui o `link_download`
por um link encurtador que pague por clique (ex: Shrinkme.io, AdFly).
