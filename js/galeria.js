// ===================================================================
// CONSTRUCCIÓN AUTOMÁTICA DE LA GALERÍA
// ===================================================================
// Lee galeria-datos.js y construye el año > evento > fotos.
(() => {
  const contenedor = document.getElementById('galeriaContenedor');
  if (!contenedor || typeof GALERIA_DATOS === 'undefined') return;

  const MAX_FOTOS_POR_EVENTO = 60;  // límite de seguridad por evento
  const MAX_FALLOS_SEGUIDOS = 2;    // tolera algún hueco suelto en la numeración

  // Precarga de imágenes
  function existeImagen(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  // Carga imágenes
  async function cargarFotosEvento(prefijo, grid) {
    let fallosSeguidos = 0;

    for (let i = 1; i <= MAX_FOTOS_POR_EVENTO && fallosSeguidos < MAX_FALLOS_SEGUIDOS; i++) {
      const src = `${prefijo}-${i}.webp`;
      const existe = await existeImagen(src);

      if (existe) {
        fallosSeguidos = 0;
        const figure = document.createElement('figure');
        figure.className = 'polaroid polaroid--tilt-left';
        const img = document.createElement('img');
        img.className = 'polaroid__photo';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = '';
        img.src = src;
        figure.appendChild(img);
        grid.appendChild(figure);
      } else {
        fallosSeguidos++;
      }
    }
  }

  // Construye la estructura año > evento > imágenes
  GALERIA_DATOS.forEach(grupo => {
    const seccion = document.createElement('section');
    seccion.className = 'galeria-grupo';
    seccion.dataset.anio = grupo.anio;

    const tituloAnio = document.createElement('h2');
    tituloAnio.className = 'galeria-grupo__anio';
    tituloAnio.textContent = grupo.anio;
    seccion.appendChild(tituloAnio);

    grupo.eventos.forEach(evento => {
      const divEvento = document.createElement('div');
      divEvento.className = 'galeria-evento galeria-evento--colapsado';
      divEvento.dataset.evento = evento.id;

      const tituloEvento = document.createElement('h3');
      tituloEvento.className = 'galeria-evento__titulo';
      tituloEvento.textContent = evento.titulo;

      const grid = document.createElement('div');
      grid.className = 'grid-galeria';

      divEvento.appendChild(tituloEvento);
      divEvento.appendChild(grid);
      seccion.appendChild(divEvento);

      let fotosCargadas = false;
      tituloEvento.addEventListener('click', () => {
        if (fotosCargadas) return;
        fotosCargadas = true;
        cargarFotosEvento(evento.prefijo, grid);
      });
    });

    contenedor.appendChild(seccion);
  });
})();