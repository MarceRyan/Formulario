(() => {
  // ----------------------
  // Estado y data
  // ----------------------
  const state = {
    preloadStarted: false,
    imagesPreloaded: false,
    welcome: { nombre: "", celular: "", correo: "" },
    slideIndex: 0,
  };

  const slides = [
  {
    chip: "Vista 1",
    lugar: "Paracas",
    titulo: "Islas Ballestas",
    desc:
      "¿Conoces este lugar? Se llama Islas Ballestas, donde haremos un recorrido en bote para ver un paisaje marino impresionante y vida silvestre en su hábitat natural.",
    bullets: [
      "Recorrido en bote por la costa",
      "Paisaje marino impresionante",
      "Avistamiento de vida silvestre",
      "Tiempo para fotos",
    ],
    img: "./assets/img1.jpg",
    alt: "Paracas - Islas Ballestas",
  },
  {
    chip: "Vista 2",
    lugar: "Paracas",
    titulo: "Fauna en Islas Ballestas",
    desc:
      "¡Miraaa! ¡Unos pingüinos! Ahh… y hay leones marinos, así que tendrás que alistar tu cámara 📸",
    bullets: [
      "Ver animales marinos (si no hay, pido mi reembolso 😤)",
      "Tomar fotitos y videos",
      "Abrígate: hace un poquito de frío",
      "Disfrutar el momento sin apuro",
    ],
    img: "./assets/img2.jpg",
    alt: "Paracas - Fauna (pingüinos y leones marinos)",
  },
  {
    chip: "Vista 3",
    lugar: "Ica",
    titulo: "Huacachina",
    desc:
      "¿Conoces este desierto? Es la Huacachina y está en Ica, así que es la siguiente ruta. Es un oasis entre dunas: caminatas suaves, paisaje amplio y desierto… y al final nos quedaremos hasta el atardecer.",
    bullets: [
      "Paseo por el oasis",
      "Caminata suave por las dunas",
      "Fotos con paisaje amplio",
      "Quedarnos hasta el atardecer",
    ],
    img: "./assets/img3.jpg",
    alt: "Ica - Huacachina (oasis entre dunas)",
  },
  {
    chip: "Vista 4",
    lugar: "Ica",
    titulo: "Buggies por el desierto",
    desc:
      "¿Te animas a subir a estos buggies? Es un deporte extremo que me gusta y supongo que te va a gustar a ti. Haremos los famosos tubulares 😎",
    bullets: [
      "Subir a los tubulares (buggies)",
      "Ruta por dunas con paradas",
      "Gritar un ratito 😂",
      "Fotos épicas en el desierto",
    ],
    img: "./assets/img4.jpg",
    alt: "Ica - Buggies (tubulares) por el desierto",
  },
  {
    chip: "Vista 5",
    lugar: "Ica",
    titulo: "Sandboarding al atardecer",
    desc:
      "Mira estas tablas… ¿alguna vez hiciste sandboarding? Es muy divertido, perooo te cuento algo: te tienes que sujetar fuerte, si no, ruedas en la arena 😅 Aquí nos quedaremos hasta el atardecer para que tengas una vista hermosa.",
    bullets: [
      "Probar sandboarding (si te animas)",
      "Sujétate fuerte 😅",
      "Fotos con el cielo del atardecer",
      "Cerrar el día con una vista hermosa",
    ],
    img: "./assets/img5.jpg",
    alt: "Ica - Sandboarding al atardecer",
  },
];

  // ----------------------
  // Helpers
  // ----------------------
  const $ = (sel) => document.querySelector(sel);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function isValidName(v) { return (v || "").trim().length >= 2; }
  function isValidPhone(v) { return (v || "").trim().length >= 7; }
  function isValidEmail(v) { return /^\S+@\S+\.\S+$/.test((v || "").trim()); }

  // ----------------------
  // Precarga (cuando escribe)
  // ----------------------
  function preloadImagesOnce() {
    if (state.preloadStarted) return;
    state.preloadStarted = true;

    const urls = slides.map((s) => s.img);
    Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
          })
      )
    ).then((results) => {
      state.imagesPreloaded = results.every(Boolean);
    });
  }

  // ----------------------
  // Steps
  // ----------------------
  const stepWelcome = $("#step-welcome");
  const stepItinerary = $("#step-itinerary");
  const stepDecision = $("#step-decision"); // (si existe)
  const stepFinal = $("#step-final");       // (si existe)

  function showStep(stepEl) {
    [stepWelcome, stepItinerary, stepDecision, stepFinal].forEach((el) => el && el.classList.remove("is-active"));
    stepEl.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ----------------------
  // Paso 1: Welcome
  // ----------------------
  function bootWelcome() {
    const wNombre = $("#wNombre");
    const wCelular = $("#wCelular");
    const wCorreo = $("#wCorreo");
    const btnWelcomeNext = $("#btnWelcomeNext");

    const updateWelcomeButton = () => {
      const ok = isValidName(wNombre.value) && isValidPhone(wCelular.value) && isValidEmail(wCorreo.value);
      btnWelcomeNext.disabled = !ok;
    };

    [wNombre, wCelular, wCorreo].forEach((el) => {
      el.addEventListener("input", () => {
        preloadImagesOnce();
        updateWelcomeButton();
      });
    });

    updateWelcomeButton();

    btnWelcomeNext.addEventListener("click", async () => {
  // 🔊 reproducir música al pasar del paso bienvenida
  const audio = document.querySelector("#bgMusic");
  if (audio) {
    try {
      audio.volume = 0.6;     // ajusta 0.0 - 1.0
      audio.loop = true;      // opcional
      await audio.play();     // importante: dentro del click
    } catch (e) {
      // Si el navegador bloquea por alguna razón, no rompemos el flujo
      console.warn("Audio bloqueado:", e);
    }
  }
  state.welcome.nombre = wNombre.value.trim();
  state.welcome.celular = wCelular.value.trim();
  state.welcome.correo = wCorreo.value.trim();

  preloadImagesOnce(); // no bloquea

  // mostrar paso intermedio
  const stepInter = document.querySelector("#step-intermediate");
  if (stepInter) {
    showStep(stepInter);
    await fillIntermediateMessage(); // ✅ animación
  }
});
  }

  // ----------------------
  // Paso 2: Itinerario
  // ----------------------
  const chipsEl = $("#chips");
  const progressBar = $("#progressBar");
  const counter = $("#counter");
  const slideFade = $("#slideFade");
  const slideImg = $("#slideImg");
  const imgSkeleton = $("#imgSkeleton");
  const slideKicker = $("#slideKicker");
  const slideTitle = $("#slideTitle");
  const slideDesc = $("#slideDesc");
  const slideBullets = $("#slideBullets");
  const btnPrev = $("#btnPrev");
  const btnNext = $("#btnNext");

  function buildChips() {
    if (!chipsEl) return;
    chipsEl.innerHTML = "";
    slides.forEach((s, idx) => {
      const chip = document.createElement("div");
      chip.className = "chip" + (idx === state.slideIndex ? " is-active" : "");
      chip.textContent = s.chip;
      chipsEl.appendChild(chip);
    });
  }

  function updateProgress() {
    const i = state.slideIndex;
    if (counter) counter.textContent = `${i + 1}/${slides.length}`;

    if (progressBar) {
      const pct = ((i + 1) / slides.length) * 100;
      progressBar.style.width = `${pct}%`;
    }

    if (chipsEl) {
      [...chipsEl.children].forEach((c, idx) => c.classList.toggle("is-active", idx === i));
    }

    if (btnPrev) btnPrev.disabled = i === 0;
    if (btnNext) btnNext.textContent = (i === slides.length - 1) ? "Continuar" : "Siguiente";
  }

  function setImageWithSkeleton(src, alt) {
    if (!slideImg || !imgSkeleton) return;

    // Muestra skeleton y limpia imagen
    imgSkeleton.classList.remove("is-hidden");
    imgSkeleton.textContent = "Cargando imagen…";
    slideImg.alt = alt || "";
    slideImg.src = "";

    const loader = new Image();
    loader.onload = () => {
      slideImg.src = src;
      imgSkeleton.classList.add("is-hidden");
    };
    loader.onerror = () => {
      // Si falla, deja el skeleton con mensaje (y te ayuda a detectar ruta mal)
      imgSkeleton.textContent = "No se pudo cargar. Revisa /assets/img1.jpg...";
    };
    loader.src = src;
  }

  async function renderSlide(skipFade = false) {
    updateProgress();

    const s = slides[state.slideIndex];
    if (!s) return;

    if (!skipFade && slideFade) {
      slideFade.classList.add("is-fading");
      await wait(190);
    }

    if (slideKicker) slideKicker.textContent = `${s.lugar} · ${s.titulo}`;
    if (slideTitle) slideTitle.textContent = s.titulo;
    if (slideDesc) slideDesc.textContent = s.desc;

    if (slideBullets) {
      slideBullets.innerHTML = "";
      s.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        slideBullets.appendChild(li);
      });
    }

    setImageWithSkeleton(s.img, s.alt);

    if (!skipFade && slideFade) {
      await wait(40);
      slideFade.classList.remove("is-fading");
    }
  }

  function bootItinerary() {
    if (btnPrev) {
      btnPrev.addEventListener("click", async () => {
        if (state.slideIndex <= 0) return;
        state.slideIndex -= 1;
        await renderSlide(false);
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", async () => {
        const last = state.slideIndex === slides.length - 1;
        if (last) {
          // Si tienes step decision, va ahí. Si no, solo avisa.
          if (stepDecision) showStep(stepDecision);
          else alert("Fin del itinerario (Paso 3 aún no está montado).");
          return;
        }
        state.slideIndex += 1;
        await renderSlide(false);
      });
    }
  }
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function moveButtonRandomly(btn) {
  if (!btn) return;

  // Activa modo “fixed” para que pueda moverse por toda la pantalla
  btn.classList.add("is-dodging");

  // Necesitamos sus medidas reales ya en fixed
  const rect = btn.getBoundingClientRect();

  const pad = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxX = Math.max(pad, vw - rect.width - pad);
  const maxY = Math.max(pad, vh - rect.height - pad);

  const x = Math.round(rand(pad, maxX));
  const y = Math.round(rand(pad, maxY));

  // Guardamos en variables CSS (opcional) + estilo directo
  btn.style.setProperty("--dodge-x", `${x}px`);
  btn.style.setProperty("--dodge-y", `${y}px`);
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;

  // Un toque de “rebote” leve
  const rot = rand(-3, 3).toFixed(2);
  btn.style.transform = `translateZ(0) rotate(${rot}deg) scale(1.02)`;

  // Regresar a normal después de un momento (para que no quede “torcido”)
  setTimeout(() => {
    btn.style.transform = "translateZ(0)";
  }, 260);
}

function resetDodging(btns = []) {
  btns.forEach((btn) => {
    if (!btn) return;
    btn.classList.remove("is-dodging");
    btn.style.left = "";
    btn.style.top = "";
    btn.style.transform = "";
    btn.style.removeProperty("--dodge-x");
    btn.style.removeProperty("--dodge-y");
  });
}
  // Paso 3: Decisión (agrega o reemplaza esta sección)
function bootDecision() {
  // Dentro de tu bootDecision() o donde manejes el Paso 3:
const btnNo = document.querySelector("#btnNo");
const btnPensar = document.querySelector("#btnPensar");
const btnSi = document.querySelector("#btnSi");

const stepFinal = document.querySelector("#step-final");

// Si tienes estos inputs del form final:
const fNombre = document.querySelector("#fNombre");
const fTel = document.querySelector("#fTel");
const fCorreo = document.querySelector("#fCorreo");
const fServicio = document.querySelector("#fServicio");
const fDia = document.querySelector("#fDia");

// (Opcional) resumen
const summaryName = document.querySelector("#summaryName");
const summaryPhone = document.querySelector("#summaryPhone");
const summaryEmail = document.querySelector("#summaryEmail");

// Tu showStep y toast (si ya los tienes, usa los tuyos)
const showStep = (stepEl) => {
  document.querySelectorAll(".step").forEach((el) => el.classList.remove("is-active"));
  stepEl.classList.add("is-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const toast = (msg) => {
  const host = document.querySelector("#toastHost");
  if (!host) return alert(msg);
  host.innerHTML = `<div class="toast"><div><strong> </strong> <span>${msg}</span></div></div>`;
  setTimeout(() => (host.innerHTML = ""), 2200);
};

// ✅ “No” se mueve
if (btnNo) {
  btnNo.addEventListener("click", (e) => {
    e.preventDefault();
    toast("Tienes que decir que si");
    moveButtonRandomly(btnNo);
  });
}

// ✅ “Quiero pensarlo” se mueve
if (btnPensar) {
  btnPensar.addEventListener("click", (e) => {
    e.preventDefault();
    toast("Puedes pensarlo con calma, pero no lo dejare, di SIUUUU!!!!");
    moveButtonRandomly(btnPensar);
  });
}

// ✅ “Sí” entra al formulario y resetea los botones escapistas
if (btnSi) {
  btnSi.addEventListener("click", () => {
    // Reset para que cuando regresen no queden flotando
    resetDodging([btnNo, btnPensar]);

    // Prefill con lo del inicio (asumiendo tu state.welcome)
    fNombre.value = (state?.welcome?.nombre || "").trim();
    fTel.value = (state?.welcome?.celular || "").trim();
    fCorreo.value = (state?.welcome?.correo || "").trim();

    // Readonly defaults
    if (fServicio) fServicio.value = "Paquete premium";
    if (fDia) fDia.value = "17 de enero";

    // Resumen (si existe)
    if (summaryName) summaryName.textContent = fNombre.value || "—";
    if (summaryPhone) summaryPhone.textContent = fTel.value || "—";
    if (summaryEmail) summaryEmail.textContent = fCorreo.value || "—";

    // Ir al paso 4
    if (stepFinal) showStep(stepFinal);
  });
}
}

async function fillIntermediateMessage() {
  const top = document.querySelector("#interMsgTop");
  const quoteBox = document.querySelector("#quoteBox");
  const actions = document.querySelector("#interActions");

  if (!top) return;

  // reset cada vez que entras
  if (quoteBox) quoteBox.style.display = "none";
  if (actions) actions.style.display = "none";

  const nombre = (state?.welcome?.nombre || "").trim();
  const nombreTxt = nombre ? `, ${nombre}` : "";

  const msg =
  `Mira${nombreTxt}: quiero que esto sea un respiro de verdad. ` +
  `Sé que a veces el trabajo pesa (y más cuando estás buscando), ` +
  `y también sé que tuviste un año bien pesadito. ` +
  `Por eso quiero que al menos este 2026 lo empieces alegre como se debe: ` +
  `con un plan bonito, sin presión, sin cosas raras… solo tú, yo y una aventura. ` +
  `Salir, reír un poco, desconectar, tomar fotos, caminar, correr si te provoca, ` +
  `y volver con la mente más ligera y el corazón más contento. `+
  `Asi que te dedico esta frase:`;

  // 1) escribir letra por letra
  await typewriter(top, msg, 18);

  // 2) luego aparece el mensaje final como bloque (no letra por letra)
  showWithReveal(quoteBox);

  // 3) y aparecen los botones
  showWithReveal(actions);
}

function bootIntermediate() {
  const stepInter = document.querySelector("#step-intermediate");
  const btnNo = document.querySelector("#btnInterNo");
  const btnGo = document.querySelector("#btnInterGo");

  const toast = (msg) => {
    const host = document.querySelector("#toastHost");
    if (!host) return alert(msg);
    host.innerHTML = `<div class="toast"><div><strong>OK</strong> <span>${msg}</span></div></div>`;
    setTimeout(() => (host.innerHTML = ""), 2200);
  };

  const showStep = (stepEl) => {
    document.querySelectorAll(".step").forEach((el) => el.classList.remove("is-active"));
    stepEl.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (btnNo) {
    btnNo.addEventListener("click", () => {
      toast("Tranqui, sin presión 🙂");
      // se queda en el paso intermedio (no bloquea)
    });
  }

  if (btnGo) {
    btnGo.addEventListener("click", async () => {
      // Ir al itinerario y renderizar slide 1
      state.slideIndex = 0;

      // Estas funciones deben existir si ya tienes itinerario:
      // buildChips(); renderSlide(true); showStep(stepItinerary);
      if (typeof buildChips === "function") buildChips();
      if (typeof renderSlide === "function") await renderSlide(true);

      const stepItinerary = document.querySelector("#step-itinerary");
      if (stepItinerary) showStep(stepItinerary);
      else toast("No encuentro el itinerario en el HTML.");
    });
  }
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function typewriter(el, text, speedMs = 18) {
  return new Promise((resolve) => {
    if (!el) return resolve();

    if (prefersReducedMotion()) {
      el.textContent = text;
      el.classList.remove("is-typing");
      return resolve();
    }

    el.textContent = "";
    el.classList.add("is-typing");

    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(tick, speedMs);
      } else {
        el.classList.remove("is-typing");
        resolve();
      }
    };
    tick();
  });
}

function showWithReveal(el) {
  if (!el) return;
  el.style.display = "block";
  // reiniciar animación si se vuelve a entrar
  el.classList.remove("reveal");
  void el.offsetWidth; // reflow
  el.classList.add("reveal");
}


  // ----------------------
  // Init
  // ----------------------
 document.addEventListener("DOMContentLoaded", () => {
  bootWelcome();
  bootItinerary();
  bootIntermediate();
  bootDecision(); // ✅
});
})();
