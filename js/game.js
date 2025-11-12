// ====== Estado de puntajes e historial ======
const KEY_SCORES   = 'ethos_scores_v1';
const KEY_HISTORY  = 'ethos_history_v1'; // para desempates y analytics
const ETHOS_LIST   = ['clasico','romantico','realista','barroco'];

function getScores(){
  try {
    const s = JSON.parse(localStorage.getItem(KEY_SCORES));
    if (s && ETHOS_LIST.every(k => typeof s[k] === 'number')) return s;
  } catch(e){}
  return { clasico:0, romantico:0, realista:0, barroco:0 };
}
function saveScores(s){ localStorage.setItem(KEY_SCORES, JSON.stringify(s)); }

function resetScores(){
  saveScores({ clasico:0, romantico:0, realista:0, barroco:0 });
  localStorage.setItem(KEY_HISTORY, JSON.stringify([]));
}

// Añadir puntos a un ethos. n por defecto =1
function addPoint(ethos, n=1){
  const s = getScores();
  if(!ETHOS_LIST.includes(ethos)) return;
  s[ethos] = (s[ethos] || 0) + Number(n);
  saveScores(s);
  // guardar historia
  const h = getHistory();
  h.push(ethos);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(h));
}

function getHistory(){
  try {
    return JSON.parse(localStorage.getItem(KEY_HISTORY)) || [];
  } catch(e){ return []; }
}

// Devuelve {ganador, empate:boolean, ranking:[{k,v}...]}
function computeWinner(){
  const s = getScores();
  const ranking = ETHOS_LIST.map(k => ({k, v:s[k]}))
    .sort((a,b)=> b.v - a.v);
  const max = ranking[0].v;
  const empates = ranking.filter(r => r.v === max).map(r => r.k);
  let ganador = ranking[0].k;
  let empate = empates.length > 1;

  // Desempate: usa el último ethos elegido de la historia
  if (empate){
    const h = getHistory();
    for (let i = h.length - 1; i >= 0; i--){
      if (empates.includes(h[i])) { ganador = h[i]; empate = false; break; }
    }
  }
  return { ganador, empate, ranking };
}

// Helper: vincula todos los botones .decidir con data-ethos y data-points
function bindDecisionButtons(nextHref=null){
  document.querySelectorAll('.decidir[data-ethos]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ethos = btn.dataset.ethos;                 // clasico|romantico|realista|barroco
      const pts   = Number(btn.dataset.points || 1);   // opcional
      addPoint(ethos, pts);
      if (nextHref) window.location.href = nextHref;
    });
  });
}
