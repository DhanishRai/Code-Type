/* =========================================================
   CODE TYPE — animated particle background
   A lightweight canvas starfield / drifting-glyph effect that
   reacts to the active theme's accent color.
   ========================================================= */

(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  let width, height;
  let enabled = true;
  let animationId = null;

  const GLYPHS = "{}[]();<>/=+-*&|!01".split("");

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function getParticleColor() {
    const val = getComputedStyle(document.body).getPropertyValue("--particle-color").trim();
    return val || "255, 46, 151";
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2, // depth factor -> speed/size/opacity
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01
    };
  }

  function init(count) {
    particles = [];
    const n = count || Math.min(90, Math.floor((width * height) / 22000));
    for (let i = 0; i < n; i++) particles.push(makeParticle());
  }

  function step() {
    if (!enabled) {
      ctx.clearRect(0, 0, width, height);
      animationId = requestAnimationFrame(step);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const color = getParticleColor();

    for (const p of particles) {
      p.y -= 0.15 * p.z;
      p.x += Math.sin(p.y * 0.01) * 0.15 * p.z;
      p.angle += p.spin;

      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }

      const size = 10 + p.z * 14;
      const alpha = 0.06 + p.z * 0.16;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.font = `${size}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.glyph, 0, 0);
      ctx.restore();
    }

    animationId = requestAnimationFrame(step);
  }

  function setEnabled(val) {
    enabled = val;
  }

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  resize();
  init();
  step();

  // expose small API for app.js
  window.CodeTypeParticles = { setEnabled };
})();
