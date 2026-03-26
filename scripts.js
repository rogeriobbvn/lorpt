/**
 * ============================================================
 * CDX - Campeonato Legend Online
 * scripts.js - Renderiza dados de lutas a partir do data.json
 * ============================================================
 *
 * COMO FUNCIONA:
 * 1. Carrega data.json ao iniciar
 * 2. Popula o seletor de edições
 * 3. Ao trocar edição, renderiza lutas realizadas, pendentes e classificação
 * 4. Cada luta com youtube_url preenchido exibe um botão para assistir no YouTube
 *
 * PARA ATUALIZAR DADOS:
 * - Edite o arquivo data.json
 * - Preencha score1, score2 e youtube_url de cada luta
 * - Mude state de "open" para "complete" quando a luta for finalizada
 * ============================================================
 */

let tournamentData = null;

document.addEventListener('DOMContentLoaded', async function () {
  initTabs();
  initParallax();
  await loadData();
});

/* ========================
   CARREGAMENTO DE DADOS
   ======================== */

/**
 * Carrega data.json e inicializa a interface.
 */
async function loadData() {
  try {
    const resp = await fetch('data.json');
    tournamentData = await resp.json();
    populateEditionSelector();
    // Seleciona a última edição por padrão
    const select = document.getElementById('edition-select');
    if (select.options.length > 0) {
      select.value = select.options[select.options.length - 1].value;
      renderEdition(select.value);
    }
  } catch (err) {
    console.error('Erro ao carregar data.json:', err);
    document.getElementById('matches-complete').innerHTML =
      '<p style="color:red;padding:1rem;">Erro ao carregar dados. Verifique se data.json existe.</p>';
  }
}

/**
 * Popula o <select> com as edições disponíveis no JSON.
 */
function populateEditionSelector() {
  const select = document.getElementById('edition-select');
  select.innerHTML = '';
  tournamentData.editions.forEach(ed => {
    const opt = document.createElement('option');
    opt.value = ed.id;
    opt.textContent = ed.name;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => renderEdition(select.value));
}

/* ========================
   RENDERIZAÇÃO DA EDIÇÃO
   ======================== */

/**
 * Renderiza todos os dados de uma edição selecionada.
 * @param {string} editionId - ID da edição (ex: "ed1", "ed4")
 */
function renderEdition(editionId) {
  const edition = tournamentData.editions.find(e => e.id === editionId);
  if (!edition) return;

  // Atualiza hero
  document.getElementById('hero-title').textContent = edition.name;
  document.getElementById('hero-subtitle').textContent = edition.description;

  // Challonge link
  const challongeDiv = document.getElementById('challonge-link');
  const challongeUrl = document.getElementById('challonge-url');
  if (edition.challonge_url) {
    challongeUrl.href = edition.challonge_url;
    challongeDiv.style.display = 'block';
  } else {
    challongeDiv.style.display = 'none';
  }

  // Coleta todas as lutas de todas as fases
  const allMatches = [];
  const allStandings = [];
  const allGroups = [];

  edition.phases.forEach(phase => {
    if (phase.matches) {
      phase.matches.forEach(m => allMatches.push({ ...m, phaseName: phase.name }));
    }
    if (phase.final_match) {
      allMatches.push({ ...phase.final_match, phaseName: 'Grande Final' });
    }
    if (phase.standings) {
      allStandings.push({ phaseName: phase.name, standings: phase.standings });
    }
    if (phase.groups) {
      phase.groups.forEach(g => {
        allGroups.push({ phaseName: phase.name, groupName: g.name, standings: g.standings });
      });
    }
  });

  renderCompleteMatches(allMatches);
  renderPendingMatches(allMatches);
  renderStandings(allStandings, allGroups);
}

/* ========================
   LUTAS REALIZADAS
   ======================== */

/**
 * Renderiza lista de lutas finalizadas, agrupadas por fase.
 */
function renderCompleteMatches(allMatches) {
  const container = document.getElementById('matches-complete');
  const complete = allMatches.filter(m => m.state === 'complete');

  if (complete.length === 0) {
    container.innerHTML = '<p class="empty-msg"><i class="fas fa-info-circle"></i> Nenhuma luta realizada ainda.</p>';
    return;
  }

  // Agrupa por fase
  const byPhase = groupBy(complete, 'phaseName');
  let html = '';

  Object.entries(byPhase).forEach(([phase, matches]) => {
    html += `<h2 class="group-title"><i class="fas fa-trophy"></i> ${phase}</h2>`;
    html += '<ul class="match-list">';
    matches.forEach(m => {
      html += renderMatchItem(m);
    });
    html += '</ul>';
  });

  container.innerHTML = html;
}

/* ========================
   LUTAS PENDENTES
   ======================== */

/**
 * Renderiza lista de lutas ainda não realizadas.
 */
function renderPendingMatches(allMatches) {
  const container = document.getElementById('matches-pending');
  const pending = allMatches.filter(m => m.state === 'open');

  if (pending.length === 0) {
    container.innerHTML = '<p class="empty-msg"><i class="fas fa-check-circle"></i> Todas as lutas foram realizadas!</p>';
    return;
  }

  const byPhase = groupBy(pending, 'phaseName');
  let html = '';

  Object.entries(byPhase).forEach(([phase, matches]) => {
    html += `<h2 class="group-title"><i class="fas fa-clock"></i> ${phase}</h2>`;
    html += '<ul class="match-list">';
    matches.forEach(m => {
      const roundLabel = m.round ? `<span class="match-round">R${m.round}</span>` : '';
      html += `<li class="match-pending">
        ${roundLabel}
        <i class="fas fa-clock match-icon-pending"></i>
        <span class="match-player">${m.player1}</span>
        <span class="match-vs">vs</span>
        <span class="match-player">${m.player2}</span>
      </li>`;
    });
    html += '</ul>';
  });

  container.innerHTML = html;
}

/* ========================
   CLASSIFICAÇÃO
   ======================== */

/**
 * Renderiza tabelas de classificação (grupos e/ou fase final).
 */
function renderStandings(allStandings, allGroups) {
  const container = document.getElementById('standings-container');
  let html = '';

  // Classificação por grupos
  if (allGroups.length > 0) {
    const byPhase = groupBy(allGroups, 'phaseName');
    Object.entries(byPhase).forEach(([phase, groups]) => {
      html += `<h2 class="group-title"><i class="fas fa-chart-line"></i> ${phase}</h2>`;
      groups.forEach(g => {
        html += `<h3 class="group-title group-a" style="margin-top:1rem;"><i class="fas fa-users"></i> ${g.groupName}</h3>`;
        html += buildStandingsTable(g.standings);
      });
    });
  }

  // Classificação final
  allStandings.forEach(s => {
    html += `<h2 class="group-title" style="margin-top:2rem;"><i class="fas fa-trophy"></i> Classificação - ${s.phaseName}</h2>`;
    html += buildStandingsTable(s.standings, true);
  });

  if (!html) {
    html = '<p class="empty-msg"><i class="fas fa-info-circle"></i> Classificação ainda não disponível.</p>';
  }

  container.innerHTML = html;
}

/**
 * Gera HTML de uma tabela de classificação.
 * @param {Array} standings - Array de objetos com player, matches, wins, balance
 * @param {boolean} showPosition - Se deve exibir posição numérica
 */
function buildStandingsTable(standings, showPosition = false) {
  let html = `<div class="overflow-x-auto">
    <table class="standings-table">
      <thead><tr>
        <th><i class="fas fa-user"></i> Jogador</th>
        <th><i class="fas fa-gamepad"></i> Partidas</th>
        <th><i class="fas fa-trophy"></i> Vitórias</th>
        <th><i class="fas fa-chart-bar"></i> Saldo</th>
      </tr></thead><tbody>`;

  standings.forEach((s, i) => {
    const pos = showPosition && s.position ? `<span class="position-badge">${s.position}º</span> ` : '';
    const highlight = (showPosition && i === 0) ? ' class="row-gold"' : (showPosition && i === 1) ? ' class="row-silver"' : '';
    const balanceClass = String(s.balance).startsWith('+') ? 'balance-positive' : String(s.balance).startsWith('-') ? 'balance-negative' : '';
    const noteHtml = s.note ? ` <span class="player-note">(${s.note})</span>` : '';

    html += `<tr${highlight}>
      <td>${pos}${s.player}${noteHtml}</td>
      <td>${s.matches}</td>
      <td>${s.wins}</td>
      <td class="${balanceClass}">${s.balance}</td>
    </tr>`;
  });

  html += '</tbody></table></div>';
  return html;
}

/* ========================
   HELPERS
   ======================== */

/**
 * Renderiza um item de luta realizada (com placar e link YouTube).
 */
function renderMatchItem(m) {
  const s1 = parseInt(m.score1) || 0;
  const s2 = parseInt(m.score2) || 0;
  const s1Class = s1 > s2 ? 'score-win' : s1 < s2 ? 'score-lose' : 'score-draw';
  const s2Class = s2 > s1 ? 'score-win' : s2 < s1 ? 'score-lose' : 'score-draw';
  const note = m.note ? ` <span class="match-note">(${m.note})</span>` : '';
  const roundLabel = m.round ? `<span class="match-round">R${m.round}</span>` : '';

  let youtubeBtn = '';
  if (m.youtube_url) {
    youtubeBtn = `<a href="${m.youtube_url}" target="_blank" class="youtube-link" title="Assistir no YouTube">
      <i class="fab fa-youtube"></i>
    </a>`;
  }

  return `<li class="match-complete">
    ${roundLabel}
    <i class="fas fa-trophy match-icon-complete"></i>
    <span class="match-player">${m.player1}</span>
    <span class="${s1Class}">${m.score1}</span>
    <span class="match-x">x</span>
    <span class="${s2Class}">${m.score2}</span>
    <span class="match-player">${m.player2}</span>
    ${note}
    ${youtubeBtn}
  </li>`;
}

/**
 * Agrupa array de objetos por uma chave.
 */
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || 'Geral';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/* ========================
   TABS
   ======================== */

/**
 * Inicializa funcionalidade de abas (tabs).
 */
function initTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      button.classList.add('active');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    });
  });
}

/* ========================
   PARALLAX
   ======================== */

/**
 * Efeito parallax no hero (scroll e mouse).
 */
function initParallax() {
  const parallaxBg = document.querySelector('.parallax-bg');

  window.addEventListener('scroll', () => {
    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
    }
  });
}
