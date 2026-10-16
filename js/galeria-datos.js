// ===================================================================
// CONTENIDO DE LA GALERÍA
// ===================================================================
//
// Para AÑADIR UN EVENTO NUEVO:
//   1. Crear la carpeta de fotos, ej. img/galeria/2026/2608/
//   2. Subir las fotos numeradas: 2608-1.webp, 2608-2.webp...
//   3. Añadir un objeto al array "eventos" del año correspondiente
//      (o crear un año nuevo si no existe todavía):
//        { id: 'nombre-2608', titulo: 'Nombre del concierto', prefijo: 'img/galeria/2026/2608/2608' }

const GALERIA_DATOS = [
  {
    anio: '2026',
    eventos: [
      { id: 'rabbit-2607',    titulo: 'I Rabbit Rock Fast Fest',              prefijo: 'img/galeria/2026/2607/2607' },
      { id: 'clasijazz-2606', titulo: 'Clasijazz ft. The River Band',         prefijo: 'img/galeria/2026/2606/2606' },
      { id: 'molinillo-2605', titulo: 'Concierto Molinillo de la Abuela',     prefijo: 'img/galeria/2026/2605/2605' },
      { id: 'gador-2604',     titulo: 'Noche cultural Gádor Rock',            prefijo: 'img/galeria/2026/2604/2604' },
      { id: 'qansayar-2603',  titulo: 'II Qansayar Fest',                     prefijo: 'img/galeria/2026/2603/2603' },
      { id: 'gira-2602',      titulo: 'Gira E.P. The First ft. Satürno',      prefijo: 'img/galeria/2026/2602/2602' },
      { id: 'dragonfly-2601', titulo: 'Spring Fest ft. Sprocket',             prefijo: 'img/galeria/2026/2601/2601' }
    ]
  },
  {
    anio: '2025',
    eventos: [
      { id: 'canjayar-2504',  titulo: 'Actuación con Asociación Musical Eladio Guzmán', prefijo: 'img/galeria/2025/2504/2504' },
      { id: 'spring-2503',    titulo: 'Spring Fest',                                    prefijo: 'img/galeria/2025/2503/2503' },
      { id: 'marin-2502',     titulo: 'Marín Rock',                                     prefijo: 'img/galeria/2025/2502/2502' },
      { id: 'qansayar-2501',  titulo: 'I Qansayar Rock de Autor',                       prefijo: 'img/galeria/2025/2501/2501' }
    ]
  },
  {
    anio: '2024',
    eventos: [
      { id: 'esencia-2412',   titulo: 'Concierto en La Esencia de la Alpujarra',        prefijo: 'img/galeria/2024/2412/2412' },
      { id: 'molinillo-2411', titulo: '4º Aniversario Trashtorna2 Punkrock Band',       prefijo: 'img/galeria/2024/2411/2411' },
      { id: 'ohanes-2410',    titulo: 'Concierto en Bar Mesón San Marcos',              prefijo: 'img/galeria/2024/2410/2410' },
      { id: 'huecija-2409',   titulo: 'Concierto eléctrico en Huécija',                 prefijo: 'img/galeria/2024/2409/2409' },
      { id: 'almeria-2408',   titulo: "Concierto acústico en Mary's Bakery",            prefijo: 'img/galeria/2024/2408/2408' },
      { id: 'granada-2407',   titulo: 'Concierto eléctrico en Chiringuito Obelix',      prefijo: 'img/galeria/2024/2407/2407' },
      { id: 'beires-2406',    titulo: 'Concierto eléctrico San Roque',                  prefijo: 'img/galeria/2024/2406/2406' },
      { id: 'molinillo-2405', titulo: 'Concierto eléctrico en Molinillo de la Abuela',  prefijo: 'img/galeria/2024/2405/2405' },
      { id: 'cultural-2404',  titulo: 'Noche cultural',                                 prefijo: 'img/galeria/2024/2404/2404' },
      { id: 'cesar-2403',     titulo: 'Concierto en Taberna César',                     prefijo: 'img/galeria/2024/2403/2403' },
      { id: 'moya-2402',      titulo: 'Concierto privado Moya',                         prefijo: 'img/galeria/2024/2402/2402' },
      { id: 'golco-2401',     titulo: 'Concierto eléctrico en El Golco',                prefijo: 'img/galeria/2024/2401/2401' }
    ]
  },
  {
    anio: '2023',
    eventos: [
      { id: 'elios-2303',     titulo: 'Elios Rock',                                     prefijo: 'img/galeria/2023/2303/2303' },
      { id: 'molinillo-2302', titulo: 'Concierto en El Molinillo de la Abuela',         prefijo: 'img/galeria/2023/2302/2302' },
      { id: 'mujer-2301',     titulo: 'Día de la Mujer ft. Dúo Costa de Almería',       prefijo: 'img/galeria/2023/2301/2301' }
    ]
  },
  {
    anio: '2022',
    eventos: [
      { id: 'aniversar-2205', titulo: '2º Aniversario Trashtorna2 Punkrock Band',       prefijo: 'img/galeria/2022/2205/2205' },
      { id: 'cesar-2204',     titulo: 'Concierto en Taberna César',                     prefijo: 'img/galeria/2022/2204/2204' },
      { id: 'esencia-2203',   titulo: 'Concierto en La Esencia de la Alpujarra',        prefijo: 'img/galeria/2022/2203/2203' },
      { id: 'mujer-2202',     titulo: 'Concierto por el Día de la Mujer',               prefijo: 'img/galeria/2022/2202/2202' },
      { id: 'primer-2201',    titulo: '1º directo Trashtorna2 Punkrock Band',           prefijo: 'img/galeria/2022/2201/2201' }
    ]
  }
];
