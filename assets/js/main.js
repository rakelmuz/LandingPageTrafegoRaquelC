/* Raquel Fátima · Tráfego Pago — animações e formulário */
(function(){
  /* Coloque aqui o seu WhatsApp com DDI e DDD, só números (ex.: "5535999999999").
     Enquanto estiver vazio, o botão abre o direct do Instagram. */
  var WHATSAPP = "5535992072879";

  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.dw path,.dw line,.dw circle,.dw rect,.dw ellipse,.dw polyline').forEach(function(el){ el.setAttribute('pathLength','1'); });

  /* tema claro / escuro */
  var themeBtn = document.getElementById('theme-btn');
  function applyTheme(t){
    root.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    try { localStorage.setItem('rq-tema', t); } catch(e){}
  }
  if (themeBtn){
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    themeBtn.addEventListener('click', function(){ applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
  }

  /* números */
  var nf0 = new Intl.NumberFormat('pt-BR');
  var nf2 = new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  function fmt(el, v){ var d = +(el.getAttribute('data-dec')||0); return (el.getAttribute('data-pre')||'') + (d ? nf2.format(v) : nf0.format(Math.round(v))); }
  function countUp(el){
    var to = parseFloat(el.getAttribute('data-to')); if (reduce){ el.textContent = fmt(el,to); return; }
    var t0 = null, dur = 1400;
    function step(t){ if(!t0) t0=t; var p=Math.min(1,(t-t0)/dur); var e=1-Math.pow(1-p,3); el.textContent = fmt(el, to*e); if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  /* entradas ao rolar */
  var items = document.querySelectorAll('.io');
  function enter(el){ el.classList.add('in'); if (el.id === 'dash') el.querySelectorAll('.count').forEach(countUp); }
  if (reduce || !('IntersectionObserver' in window)){ items.forEach(function(el){ el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ enter(e.target); io.unobserve(e.target); } }); }, {threshold:.2, rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }

  /* hero: anúncio → clique → conversa */
  var stage = document.querySelector('.stage');
  if (stage && !reduce){
    var cur = stage.querySelector('.cursor'), cta = stage.querySelector('.ad-cta'), toast = stage.querySelector('.toast'), conv = stage.querySelector('[data-conv]');
    var n = 57, visible = true;
    function rel(el, fx, fy){ var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(); return {x: r.left - s.left + r.width*fx, y: r.top - s.top + r.height*fy}; }
    function home(){ var s = stage.getBoundingClientRect(); cur.style.transform = 'translate(' + (s.width*0.5) + 'px,' + (s.height*0.95) + 'px)'; }
    home();
    function cycle(){
      if (!visible || document.hidden) return;
      toast.classList.remove('show');
      var p = rel(cta, .78, .45);
      cur.classList.add('show');
      cur.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
      setTimeout(function(){ cta.classList.add('tap'); setTimeout(function(){ cta.classList.remove('tap'); }, 520); }, 1100);
      setTimeout(function(){ toast.classList.add('show'); n = n >= 62 ? 57 : n + 1; conv.setAttribute('data-to', n); conv.textContent = nf0.format(n); }, 1500);
      setTimeout(function(){ cur.classList.remove('show'); home(); }, 3200);
    }
    if ('IntersectionObserver' in window){ new IntersectionObserver(function(es){ visible = es[0].isIntersecting; }).observe(stage); }
    setTimeout(function(){ cycle(); setInterval(cycle, 6500); }, 2600);
    window.addEventListener('resize', home);
  }

  /* formulário → mensagem pronta no WhatsApp */
  var form = document.getElementById('lead'), send = document.getElementById('send'), hint = document.getElementById('send-hint');
  function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function build(){
    var nome = val('f-nome'), cidade = val('f-cidade'), neg = val('f-negocio'), txt = val('f-msg');
    var sel = document.getElementById('f-tipo'), tipo = sel && sel.selectedOptions[0] ? sel.selectedOptions[0].textContent.trim() : '';
    var linhas = [];
    if (nome) linhas.push('*Nome:* ' + nome);
    if (cidade) linhas.push('*Cidade:* ' + cidade);
    if (neg) linhas.push('*Ramo do negócio:* ' + neg);
    if (tipo) linhas.push('*Tipo de negócio:* ' + tipo);
    var s = 'Olá! Vim pelo site e gostaria de conversar sobre tráfego pago.';
    if (linhas.length) s += '\n\n' + linhas.join('\n');
    if (txt) s += '\n\n*Mensagem:*\n' + txt;
    if (WHATSAPP){
      send.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(s);
    } else {
      hint.textContent = 'Sua mensagem será preparada e copiada automaticamente. Depois, é só colar no direct do Instagram e enviar.';
    }
    return s;
  }
  form.addEventListener('input', build);
  form.addEventListener('change', build);
  form.addEventListener('submit', function(e){ e.preventDefault(); });
  send.addEventListener('click', function(){
    var s = build();
    if (!WHATSAPP && navigator.clipboard){ navigator.clipboard.writeText(s).then(function(){ hint.textContent = 'Mensagem copiada. Cole no direct do Instagram e envie.'; }, function(){}); }
  });
  build();
})();
