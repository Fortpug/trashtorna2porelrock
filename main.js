// ===================================================================
// TRASHTORNA2 POR EL ROCK — main.js
// ===================================================================

// --- Menú hamburguesa (móvil) ---
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    // Alterna la clase .is-active en el menú y en el botón
    const isOpen = nav.classList.toggle('is-active');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    
    // Bloquea el scroll del fondo cuando el menú está abierto
    document.body.classList.toggle('no-scroll', isOpen);
  });

  // Cierra el menú automáticamente al hacer clic en cualquier enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-active');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });
}

// --- Modal "Info y entradas" ---
const modalConcierto = document.getElementById('modalConcierto');
const btnInfoConcierto = document.getElementById('btnInfoConcierto');
const btnCerrarModal = document.getElementById('btnCerrarModal');

if (modalConcierto && btnInfoConcierto) {
  btnInfoConcierto.addEventListener('click', () => {
    modalConcierto.showModal();
  });
  btnCerrarModal.addEventListener('click', () => {
    modalConcierto.close();
  });
}

// --- Cabecera flotante sobre el Hero (solo en Portada) ---
const header = document.getElementById('header');

if (header && header.classList.contains('header--hero-mode')) {
  const activarScrolled = () => {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  activarScrolled(); // por si la página carga ya con scroll
  window.addEventListener('scroll', activarScrolled);
}

// --- Estuche de discografía (selector de álbumes tipo caja de CD) ---
const ventana = document.getElementById('jewelVentana');
const playBtn = document.querySelector('.jewel-case__btn--play');
const items = document.querySelectorAll('.jewel-case__item');
const nombreEl = document.getElementById('jewelNombre');
const anioEl = document.getElementById('jewelAnio');

// Calcula qué carátula está visible dividiendo el scroll actual entre el ancho del estuche
const getItemVisible = () => {
  const index = Math.round(ventana.scrollLeft / ventana.offsetWidth);
  return items[index];
};

// Actualiza el nombre y el año según la carátula visible
const actualizarInfoDisco = () => {
  const activeItem = getItemVisible();
  if (activeItem && nombreEl && anioEl) {
    nombreEl.textContent = activeItem.dataset.nombre || '';
    anioEl.textContent = activeItem.dataset.anio || '';
  }
};

if (ventana) {
  actualizarInfoDisco(); // estado inicial
  ventana.addEventListener('scroll', actualizarInfoDisco);
}

// Flecha Anterior
document.querySelector('.jewel-case__btn--prev')?.addEventListener('click', () => {
  ventana.scrollBy({ left: -ventana.offsetWidth, behavior: 'smooth' });
});

// Flecha Siguiente
document.querySelector('.jewel-case__btn--next')?.addEventListener('click', () => {
  ventana.scrollBy({ left: ventana.offsetWidth, behavior: 'smooth' });
});

// Botón PLAY: Redirige según el álbum seleccionado
playBtn?.addEventListener('click', (e) => {
  e.preventDefault(); // Evita la navegación por defecto

  const activeItem = getItemVisible();

  if (activeItem) {
    const albumUrl = activeItem.getAttribute('data-link');
    if (albumUrl) {
      window.location.href = albumUrl; // Redirige a la página del álbum visible
    }
  }
});

// --- Reproductor de la página del álbum ---
const botonesAudio = document.querySelectorAll('.btn-play-pause');
const disco = document.getElementById('cdDisco');
let audioActual = new Audio();
let botonActivo = null;
let filaActiva = null;

// Iconos SVG en formato texto para inyección dinámica
const svgPlay = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const svgPause = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

// Recuerda el volumen elegido en cada fila (por defecto, 100%)
const volumenPorFila = new Map();

// Genera las barras del espectro (una sola vez) y conecta clic-para-saltar + volumen
document.querySelectorAll('.cancion-fila').forEach(fila => {
  const contenedorBarras = fila.querySelector('[data-progreso]');
  if (contenedorBarras) {
    const numBarras = 70;
    for (let i = 0; i < numBarras; i++) {
      const barra = document.createElement('div');
      barra.className = 'barra-eq';
      barra.style.setProperty('--h', `${20 + Math.random() * 80}%`);
      contenedorBarras.appendChild(barra);
    }

    contenedorBarras.addEventListener('click', (e) => {
      if (fila !== filaActiva || !audioActual.duration) return;
      const rect = contenedorBarras.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audioActual.currentTime = ratio * audioActual.duration;
    });
  }

  const sliderVol = fila.querySelector('[data-volumen]');
  if (sliderVol) {
    volumenPorFila.set(fila, 1);
    sliderVol.addEventListener('input', () => {
      const valor = parseFloat(sliderVol.value);
      volumenPorFila.set(fila, valor);
      if (fila === filaActiva) {
        audioActual.volume = valor;
      }
    });
  }
});

// Colorea las barras según el progreso de la canción activa
const actualizarBarras = () => {
  if (!filaActiva || !audioActual.duration) return;
  const barras = filaActiva.querySelectorAll('.barra-eq');
  const activas = Math.floor((audioActual.currentTime / audioActual.duration) * barras.length);
  barras.forEach((barra, i) => barra.classList.toggle('activa', i < activas));
};
const resetearBarras = (fila) => {
  fila?.querySelectorAll('.barra-eq').forEach(b => b.classList.remove('activa'));
};
audioActual.addEventListener('timeupdate', actualizarBarras);

if (botonesAudio.length > 0 && disco) {
  botonesAudio.forEach(boton => {
    boton.addEventListener('click', function() {
      const fila = this.closest('.cancion-fila');
      const rutaAudio = this.getAttribute('data-src');

      const intentarReproducir = () => {
        audioActual.volume = volumenPorFila.get(fila) ?? 1;
        const playPromise = audioActual.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError') {
              console.warn("Error al reproducir audio:", error);
              this.innerHTML = svgPlay;
              disco.classList.remove('girando');
            }
          });
        }
        this.innerHTML = svgPause;
        disco.classList.add('girando');
      };

      if (botonActivo === this) {
        if (!audioActual.paused) {
          audioActual.pause();
          this.innerHTML = svgPlay;
          disco.classList.remove('girando');
        } else {
          if (audioActual.currentTime >= audioActual.duration) {
            audioActual.currentTime = 0;
          }
          intentarReproducir();
        }
      }
      else {
        if (botonActivo) botonActivo.innerHTML = svgPlay;
        resetearBarras(filaActiva);

        botonActivo = this;
        filaActiva = fila;
        audioActual.src = rutaAudio;
        intentarReproducir();
      }
    });
  });

  audioActual.addEventListener('ended', () => {
    if (botonActivo) botonActivo.innerHTML = svgPlay;
    disco.classList.remove('girando');
    resetearBarras(filaActiva);
  });
}

// --- Marca automáticamente el primer ticket de cada año (para el espacio extra entre años) ---
document.querySelectorAll('.ticket').forEach((ticket, i, todos) => {
  const anioAnterior = todos[i - 1]?.dataset.anio;
  if (i > 0 && ticket.dataset.anio !== anioAnterior) {
    ticket.classList.add('ticket--nuevo-anio');
  }
});

// --- Selector de años tipo rueda sincronizado (conciertos.html) ---
const rueda = document.getElementById('rueda');
const ruedaWrap = document.getElementById('ruedaWrap');
const tickets = document.getElementById('tickets');
const ticketsWrap = document.getElementById('ticketsWrap');

if (rueda && ruedaWrap && tickets && ticketsWrap) {
  rueda.addEventListener('scrollend', () => {
    const centroRueda = rueda.getBoundingClientRect().top + rueda.clientHeight / 2;

    document.querySelectorAll('.anio').forEach((elemento) => {
      const caja = elemento.getBoundingClientRect();
      if (centroRueda >= caja.top && centroRueda <= caja.bottom) {
        elemento.classList.add('activo');
      } else {
        elemento.classList.remove('activo');
      }
    });
  });

  const anioItems = Array.from(rueda.querySelectorAll('.anio'));
  const anioList = anioItems.map(i => i.dataset.anio);
  const ticketEls = Array.from(tickets.querySelectorAll('.ticket'));

  let anioVisible = anioList[0] || '2026';
  let indiceAnio = 0;
  let indiceTicket = 0;
  let bloqueadoTickets = false;
  let bloqueadoRueda = false;

  function pintarRueda() {
    const centro = rueda.scrollTop + rueda.clientHeight / 2;
    anioItems.forEach(it => {
      const mid = it.offsetTop + it.offsetHeight / 2;
      const dist = Math.abs(mid - centro);
      const escala = Math.max(0.45, 1 - dist / 120);
      it.style.opacity = Math.max(0.2, 1 - dist / 100);
      it.style.fontSize = `${24 + 28 * escala}px`;
      
      // Texto del año activo con un tono blanco más suave / menos saturado (85% opacidad)
      it.style.color = dist < 20 ? 'rgba(240, 240, 240, 0.85)' : 'rgba(200, 200, 200, 0.3)';
    });
  }

  function pintarTickets() {
    ticketEls.forEach(t => {
      t.style.opacity = t.dataset.anio === anioVisible ? '1' : '0.28';
    });
  }

  function scrollRuedaA(anio, animar) {
    const item = anioItems.find(i => i.dataset.anio === anio);
    if (!item) return;
    rueda.scrollTo({
      top: item.offsetTop - rueda.clientHeight / 2 + item.offsetHeight / 2,
      behavior: animar ? 'smooth' : 'auto'
    });
  }

  function irATicket(i, animar) {
    i = Math.max(0, Math.min(ticketEls.length - 1, i));
    indiceTicket = i;
    const centroY = tickets.clientHeight / 2;
    const objetivo = ticketEls[i];
    tickets.scrollTo({
      top: objetivo.offsetTop - centroY + objetivo.offsetHeight / 2,
      behavior: animar ? 'smooth' : 'auto'
    });
    const nuevoAnio = objetivo.dataset.anio;
    if (nuevoAnio !== anioVisible) {
      anioVisible = nuevoAnio;
      indiceAnio = anioList.indexOf(nuevoAnio);
      scrollRuedaA(anioVisible, true);
    }
    pintarTickets();
  }

  function irAAnio(i, animar) {
    i = Math.max(0, Math.min(anioList.length - 1, i));
    indiceAnio = i;
    const anio = anioList[i];
    anioVisible = anio;
    scrollRuedaA(anio, animar);
    const primerIndice = ticketEls.findIndex(t => t.dataset.anio === anio);
    if (primerIndice !== -1) irATicket(primerIndice, animar);
  }

  ticketsWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (bloqueadoTickets) return;
    bloqueadoTickets = true;
    irATicket(indiceTicket + (e.deltaY > 0 ? 1 : -1), true);
    setTimeout(() => { bloqueadoTickets = false; }, 380);
  }, { passive: false });

  ruedaWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (bloqueadoRueda) return;
    bloqueadoRueda = true;
    irAAnio(indiceAnio + (e.deltaY > 0 ? 1 : -1), true);
    setTimeout(() => { bloqueadoRueda = false; }, 380);
  }, { passive: false });

  let ticketsSyncTimeout;
  tickets.addEventListener('scroll', () => {
    pintarTickets();
    clearTimeout(ticketsSyncTimeout);
    ticketsSyncTimeout = setTimeout(() => {
      const centroY = tickets.scrollTop + tickets.clientHeight / 2;
      let mejorIndice = indiceTicket;
      let mejorDist = Infinity;
      ticketEls.forEach((el, i) => {
        const mid = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(mid - centroY);
        if (dist < mejorDist) { mejorDist = dist; mejorIndice = i; }
      });
      indiceTicket = mejorIndice;
      const nuevoAnio = ticketEls[mejorIndice]?.dataset.anio;
      if (nuevoAnio && nuevoAnio !== anioVisible) {
        anioVisible = nuevoAnio;
        indiceAnio = anioList.indexOf(nuevoAnio);
        scrollRuedaA(anioVisible, true);
        pintarTickets();
      }
    }, 120);
  }, { passive: true });

  let ruedaSyncTimeout;
  rueda.addEventListener('scroll', () => {
    pintarRueda();
    clearTimeout(ruedaSyncTimeout);
    ruedaSyncTimeout = setTimeout(() => {
      const centro = rueda.scrollTop + rueda.clientHeight / 2;
      let mejorItem = anioItems[0];
      let mejorDist = Infinity;
      anioItems.forEach(it => {
        const mid = it.offsetTop + it.offsetHeight / 2;
        const dist = Math.abs(mid - centro);
        if (dist < mejorDist) { mejorDist = dist; mejorItem = it; }
      });
      const anio = mejorItem?.dataset.anio;
      if (anio && anio !== anioVisible) {
        anioVisible = anio;
        indiceAnio = anioList.indexOf(anio);
        const primerIndice = ticketEls.findIndex(t => t.dataset.anio === anio);
        if (primerIndice !== -1) irATicket(primerIndice, true);
      }
    }, 150);
  }, { passive: true });

  anioItems.forEach((it, i) => {
    it.addEventListener('click', () => irAAnio(i, true));
  });

  irAAnio(0, false);
  pintarRueda();
}

// --- Modales genéricos "Más detalles..." (conciertos.html, admite varios) ---
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.modalOpen)?.showModal();
  });
});

document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog')?.close();
  });
});

// --- Bloqueo absoluto de scroll de ventana con el mouse (Página Conciertos) ---
if (document.body.classList.contains('pagina-conciertos')) {
  window.addEventListener('wheel', (e) => {
    // Si la rueda se usa fuera de los contenedores de la rueda de años o tickets, se anula
    const sobreTickets = e.target.closest('#ticketsWrap');
    const sobreRueda = e.target.closest('#ruedaWrap');

    if (!sobreTickets && !sobreRueda) {
      e.preventDefault();
    }
  }, { passive: false });

  // Misma restricción, pero para arrastre táctil (móvil): el body no debe
  // arrastrarse libremente, solo la rueda de años y la lista de tickets.
  window.addEventListener('touchmove', (e) => {
    const sobreTickets = e.target.closest('#ticketsWrap');
    const sobreRueda = e.target.closest('#ruedaWrap');

    if (!sobreTickets && !sobreRueda) {
      e.preventDefault();
    }
  }, { passive: false });
}

// --- Botón único de navegación entre secciones de Conciertos ---
const btnToggle = document.getElementById('btnToggleConciertos');
const btnTexto = document.getElementById('btnToggleTexto');
const btnIcono = document.getElementById('btnToggleIcono');
const seccionPasados = document.getElementById('pasados');
const navFlotante = document.querySelector('.conciertos-nav-flotante');

if (btnToggle && seccionPasados) {
  let timeoutId;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (navFlotante) {
        // 1. Inicia el desvanecimiento (fade-out)
        navFlotante.classList.add('is-hidden');

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (entry.isIntersecting) {
            // Sección "pasados" -> Cambia posición a arriba y texto/icono
            btnToggle.setAttribute('href', '#proximos');
            btnTexto.textContent = 'Conciertos próximos';
            btnIcono.querySelector('path').setAttribute('d', 'm18 15-6-6-6 6');
            navFlotante.classList.add('is-top');
          } else {
            // Sección "próximos" -> Cambia posición a abajo y texto/icono
            btnToggle.setAttribute('href', '#pasados');
            btnTexto.textContent = 'Conciertos pasados';
            btnIcono.querySelector('path').setAttribute('d', 'm6 9 6 6 6-6');
            navFlotante.classList.remove('is-top');
          }

          // 2. Muestra el botón en su nueva posición (fade-in)
          navFlotante.classList.remove('is-hidden');
        }, 200); // Duración de la ocultación en ms
      }
    });
  }, { threshold: 0.4 });

  observer.observe(seccionPasados);
}

// --- Imagen "de repuesto" para tickets sin cartel (conciertos.html) ---
const TOTAL_TICKETS_REPUESTO = 9;
const RUTA_TICKETS_REPUESTO = '../img/tickets/';

document.querySelectorAll('.entrada__cartel').forEach(img => {
  const aplicarRepuesto = function () {
    // Evita bucle infinito si la propia imagen de repuesto también fallara
    if (this.dataset.repuestoAsignado) return;
    this.dataset.repuestoAsignado = 'true';

    const numAleatorio = Math.floor(Math.random() * TOTAL_TICKETS_REPUESTO) + 1;
    this.src = `${RUTA_TICKETS_REPUESTO}ticket${numAleatorio}.jpg`;
  };

  // Si la imagen ya terminó de cargar (con éxito o con fallo) antes de que
  // este script se ejecutara, el evento "error" ya pasó y nunca lo veríamos.
  // Comprobamos ese caso manualmente para las imágenes "más rápidas" en fallar.
  if (img.complete && img.naturalWidth === 0) {
    aplicarRepuesto.call(img);
  } else {
    img.addEventListener('error', aplicarRepuesto, { once: true });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__nav a');

  if (navToggle && navMenu) {
    // Alternar menú al pulsar el botón hamburguesa
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Cerrar el menú automáticamente al hacer clic en cualquier enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      });
    });
  }
});

// =======================================================
// CAMBIO DIRECTO DE PANTALLA EN MÓVIL (Fullpage Slide)
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.app-wrapper');
  const secciones = document.querySelectorAll('.hero, .seccion, .footer');
  
  if (!wrapper || !secciones.length) return;

  let currentIndex = 0;
  let startY = 0;
  let isAnimating = false;

  // Bloquea el arrastre nativo en pantallas de 768px o menos
  document.addEventListener('touchmove', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
    }
  }, { passive: false });

  // Registrar el inicio del toque
  document.addEventListener('touchstart', (e) => {
    if (window.innerWidth <= 768) {
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Al levantar el dedo, avanza o retrocede una pantalla completa
  document.addEventListener('touchend', (e) => {
    if (window.innerWidth > 768 || isAnimating) return;

    const endY = e.changedTouches[0].clientY;
    const diffY = startY - endY;

    // Sensibilidad del gesto (mínimo 30px de desplazamiento)
    if (Math.abs(diffY) > 30) {
      if (diffY > 0 && currentIndex < secciones.length - 1) {
        // Deslizar hacia arriba -> Siguiente pantalla
        currentIndex++;
        irAPantalla(currentIndex);
      } else if (diffY < 0 && currentIndex > 0) {
        // Deslizar hacia abajo -> Pantalla anterior
        currentIndex--;
        irAPantalla(currentIndex);
      }
    }
  }, { passive: true });

  function irAPantalla(index) {
    isAnimating = true;
    wrapper.style.transform = `translateY(-${index * 100}dvh)`;

    setTimeout(() => {
      isAnimating = false;
    }, 750); // Tiempo alineado con la transición CSS (0.75s)
  }
});