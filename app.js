(() => {
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const fireflies = document.getElementById("fireflies");
  const hearts = document.getElementById("hearts");
  const rand = (a,b)=>Math.random()*(b-a)+a;

  function makeFlies(count = prefersReduced ? 10 : 18){
    fireflies.innerHTML = "";
    const w = window.innerWidth, h = window.innerHeight;
    for(let i=0;i<count;i++){
      const f = document.createElement("div");
      f.className = "fly";
      f.style.left = rand(0,w) + "px";
      f.style.top  = rand(0,h) + "px";
      f.style.setProperty("--x1", rand(-60,60) + "px");
      f.style.setProperty("--y1", rand(-50,50) + "px");
      f.style.setProperty("--x2", rand(-140,140) + "px");
      f.style.setProperty("--y2", rand(-120,120) + "px");
      f.style.setProperty("--x3", rand(-70,70) + "px");
      f.style.setProperty("--y3", rand(-60,60) + "px");
      f.style.setProperty("--dur", rand(6.2,11.2) + "s");
      const s = rand(4.5,7.5);
      f.style.width = s + "px";
      f.style.height = s + "px";
      f.style.opacity = rand(.45,.95);
      fireflies.appendChild(f);
    }
  }

  function makeHearts(count = prefersReduced ? 0 : 7){
    hearts.innerHTML = "";
    const w = window.innerWidth, h = window.innerHeight;
    for(let i=0;i<count;i++){
      const el = document.createElement("div");
      el.className = "heart";

      const x = rand(0, w);
      const y = rand(h * 0.35, h + 40);
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      el.style.setProperty("--dx", `${rand(-60, 60)}px`);
      el.style.setProperty("--dur", `${rand(14, 24)}s`);

      const s = rand(7.5, 12.5);
      el.style.width = `${s}px`;
      el.style.height = `${s}px`;
      el.style.opacity = String(rand(0.12, 0.24));
      el.style.animationDelay = `${rand(0, 10)}s`;

      hearts.appendChild(el);
    }
  }

  makeFlies();
  makeHearts();

  window.addEventListener("resize", () => {
    makeFlies();
    makeHearts();
  }, { passive:true });

  // Stroke draw lengths
  function setupDraw(){
    document.querySelectorAll("path.draw").forEach(p => {
      try{
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        p.getBoundingClientRect();
      } catch {}
    });
  }

  // Audio
  const bgm = document.getElementById("bgm");
  const soundToggle = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");

  function setSoundUI(){
    if(!bgm || !soundIcon) return;
    soundIcon.textContent = bgm.muted ? "🔇" : "🔊";
  }

  function tryPlayMusic(){
    if(!bgm) return;
    bgm.volume = 0.7;
    bgm.muted = false;
    setSoundUI();
    const p = bgm.play();
    if(p && typeof p.catch === "function"){
      p.catch(() => {});
    }
  }

  if(soundToggle && bgm){
    soundToggle.addEventListener("click", () => {
      bgm.muted = !bgm.muted;
      setSoundUI();
      if(!bgm.muted){
        const p = bgm.play();
        if(p?.catch) p.catch(()=>{});
      }
    });
    setSoundUI();
  }

  // Envelope / Bouquet logic
  const envelope = document.getElementById("envelope");
  const bouquet = document.getElementById("bouquet");
  let timer = null;

  function startReveal(){
    setupDraw();
    document.body.classList.remove("idle");
    document.body.classList.add("reveal");

    clearTimeout(timer);
    timer = setTimeout(() => {
      document.body.classList.add("idle");
    }, prefersReduced ? 0 : 3600);
  }

  function open(){
    if (document.body.classList.contains("is-open")) return;
    document.body.classList.add("is-open");
    bouquet?.setAttribute("aria-hidden","false");
    startReveal();
    makeFlies(prefersReduced ? 12 : 22);
    makeHearts(prefersReduced ? 0 : 7);

    // toca a música ao abrir (interação do usuário)
    tryPlayMusic();
  }

  function replay(){
    if (!document.body.classList.contains("is-open")) return;
    document.body.classList.remove("reveal", "idle");
    requestAnimationFrame(() => requestAnimationFrame(startReveal));
  }

  envelope.addEventListener("click", open);
  envelope.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      open();
    }
  });

  bouquet.addEventListener("click", replay);
})();
