// ===== STEM FOR ALL — JavaScript =====
const $=id=>document.getElementById(id);

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
window.addEventListener('scroll',()=>{
  $('sp').style.width=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100)+'%';
},{passive:true});

// ============================================================
// NAVBAR SHADOW ON SCROLL
// ============================================================
const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('raised',window.scrollY>40);
},{passive:true});

// ============================================================
// HAMBURGER MENU (Mobile)
// ============================================================
const ham=$('ham'),nl=$('nl');
ham?.addEventListener('click',()=>{
  const o=nl.classList.toggle('open');
  ham.setAttribute('aria-expanded',o);
  const sp=ham.querySelectorAll('span');
  if(o){
    sp[0].style.transform='rotate(45deg) translate(5px,5px)';
    sp[1].style.opacity='0';
    sp[2].style.transform='rotate(-45deg) translate(5px,-5px)';
  }
  else{
    sp.forEach(s=>{s.style.transform='';s.style.opacity='';});
  }
});

// Close mobile menu when clicking a link
nl?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nl.classList.remove('open')));

// ============================================================
// HERO FULL-SCREEN SLIDESHOW
// ============================================================
const heroSlides = document.querySelectorAll('.hero-slide');
const hdots = document.querySelectorAll('.hdot');
let hCur = 0;
let hPaused = false;

// Change slide
const setHero = n => {
  hCur = (n + heroSlides.length) % heroSlides.length;
  
  // Remove active from all slides
  heroSlides.forEach(slide => slide.classList.remove('active'));
  
  // Add active to current slide
  heroSlides[hCur].classList.add('active');
  
  // Update dot indicators
  hdots.forEach((d, i) => d.classList.toggle('on', i === hCur));
};

// Initialize first slide
setHero(0);

// Auto-advance slideshow every 5.5 seconds
setInterval(() => {
  if (!hPaused) setHero(hCur + 1);
}, 5500);

// Manual control via dots
hdots.forEach(d => d.addEventListener('click', () => {
  hPaused = true;
  setHero(+d.dataset.i);
  // Resume auto-advance after 9 seconds
  setTimeout(() => hPaused = false, 9000);
}));

// Pause on hero hover
const heroSection = document.querySelector('.hero');
heroSection?.addEventListener('mouseenter', () => hPaused = true);
heroSection?.addEventListener('mouseleave', () => hPaused = false);

// ============================================================
// ANIMATED COUNTERS (for stats)
// ============================================================
const cObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting||e.target._done)return;
    e.target._done=true;
    
    const t=+e.target.dataset.c;
    const s=e.target.dataset.s||'';
    const d=2200; // duration
    const st=Date.now();
    
    const tick=()=>{
      const p=Math.min((Date.now()-st)/d,1);
      const ease=1-Math.pow(1-p,3); // easeOutCubic
      e.target.textContent=Math.round(t*ease).toLocaleString()+s;
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
},{threshold:.5});

// Attach observer to all elements with data-c attribute
document.querySelectorAll('[data-c]').forEach(el=>cObs.observe(el));

// ============================================================
// SCROLL REVEAL (fade in on scroll)
// ============================================================
const rObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      rObs.unobserve(e.target);
    }
  });
},{threshold:.1});

document.querySelectorAll('.rv').forEach(el=>rObs.observe(el));

// ============================================================
// PROGRAMME TABS
// ============================================================
document.querySelectorAll('.tb').forEach(btn=>{
  btn.addEventListener('click',()=>{
    // Remove active from all tabs and panels
    document.querySelectorAll('.tb').forEach(b=>b.classList.remove('on'));
    document.querySelectorAll('.tpane').forEach(p=>p.classList.remove('on'));
    
    // Add active to clicked tab and corresponding panel
    btn.classList.add('on');
    $(btn.dataset.t)?.classList.add('on');
    
    // Update URL hash
    window.location.hash = btn.dataset.t;
  });
});

// ============================================================
// HANDLE DIRECT NAVIGATION TO TABS VIA URL HASH
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1); // Remove the #
  
  // Valid tab IDs
  const validTabs = ['tk', 'ts', 'ta'];
  
  if (validTabs.includes(hash)) {
    // Find the button with matching data-t
    const targetBtn = document.querySelector(`[data-t="${hash}"]`);
    
    if (targetBtn) {
      // Remove active from all
      document.querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
      document.querySelectorAll('.tpane').forEach(p => p.classList.remove('on'));
      
      // Activate target
      targetBtn.classList.add('on');
      $(hash)?.classList.add('on');
      
      // Scroll to programme section after a short delay
      setTimeout(() => {
        const progSection = $('programme');
        if (progSection) {
          window.scrollTo({
            top: progSection.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
});

// ============================================================
// GALLERY LIGHTBOX
// ============================================================
const lbox=$('lbox');
const lbImg=$('lbImg');
const lbClose=$('lbx');

const closeLB=()=>{
  lbox.classList.remove('on');
  document.body.style.overflow='';
};

// Open lightbox on gallery item click
document.querySelectorAll('.gi').forEach(gi=>{
  gi.addEventListener('click',()=>{
    const bg=gi.querySelector('.gi-bg');
    const url=getComputedStyle(bg).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
    
    if(url&&!url.startsWith('data')){
      lbImg.src=url;
      lbImg.style.display='block';
    }else{
      lbImg.style.display='none';
    }
    
    lbox.classList.add('on');
    document.body.style.overflow='hidden';
  });
});

// Close lightbox
lbClose?.addEventListener('click',closeLB);
lbox?.addEventListener('click',e=>{
  if(e.target===lbox)closeLB();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeLB();
});

// ============================================================
// SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href = a.getAttribute('href');
    const hash = href.substring(1);
    
    // Check if it's a tab link
    const validTabs = ['tk', 'ts', 'ta'];
    if (validTabs.includes(hash)) {
      e.preventDefault();
      
      // Switch to the tab
      const targetBtn = document.querySelector(`[data-t="${hash}"]`);
      if (targetBtn) {
        document.querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
        document.querySelectorAll('.tpane').forEach(p => p.classList.remove('on'));
        targetBtn.classList.add('on');
        $(hash)?.classList.add('on');
      }
      
      // Scroll to programme section
      const progSection = $('programme');
      if (progSection) {
        window.scrollTo({
          top: progSection.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
      
      // Update URL
      window.location.hash = hash;
      return;
    }
    
    // Normal anchor link behavior
    const t = document.querySelector(href);
    if(t){
      e.preventDefault();
      window.scrollTo({
        top:t.getBoundingClientRect().top+window.scrollY-80,
        behavior:'smooth'
      });
    }
  });
});

// ============================================================
// FOOTER YEAR
// ============================================================
const yr=$('yr');
if(yr)yr.textContent=new Date().getFullYear();

// ============================================================
// ANIMATION STYLES (injected dynamically)
// ============================================================
const style=document.createElement('style');
style.textContent='@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(style);