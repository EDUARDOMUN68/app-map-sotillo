# APP MAP.SOTILLO

Mapa de Ávila y previsión meteorológica para Sotillo de la Adrada. Versión 0.1.0.

## Funciones

- Previsión por horas para las próximas 72 horas: temperatura, sensación, humedad relativa, precipitación, nubosidad, viento y rachas.
- Resumen textual y 15 días con máximas, mínimas, lluvia y humedad media diaria.
- Mapas de previsión de nubes, lluvia y viento mediante Windy.
- Atlas provincial con municipios, búsqueda, relieve, calles, satélite con nombres y cumbres.
- Interfaz clara y manifiesto para instalar desde el navegador del móvil mediante HTTPS.

## Fuentes y límites

Previsión ECMWF IFS HRES 9 km servida por [Open-Meteo](https://open-meteo.com/en/docs/ecmwf-api). Datos CC BY 4.0, con atribución a Open-Meteo y ECMWF. El uso gratuito de la API está sujeto a sus condiciones para uso no comercial. No contiene claves.

Las cifras son previsiones, no observaciones de una estación. Humedad relativa en %, lluvia en mm y viento en km/h. Las tarjetas diarias se calculan con las horas de cada fecha en Europe/Madrid, incluidos los cambios de hora. Los datos de la segunda semana se presentan como tendencia; no se asignan porcentajes de confianza inventados. Las horas posteriores a la resolución nativa del modelo pueden estar interpoladas por Open-Meteo.

Consulta cada hora mientras está abierta y al regresar. El modelo se renueva aproximadamente cada seis horas. La fecha visible indica la descarga, no la hora de ejecución del modelo. La última previsión se conserva en el navegador y se identifica cuando está desactualizada. La app cerrada no descarga datos en segundo plano. No se solicita geolocalización.

Windy muestra previsiones en un visor externo con su propia actualización. Puede diferir de la tabla por la ejecución del modelo usada. No representa una observación de satélite. Los mapas requieren conexión.

Municipios: Junta de Castilla y León. Geometrías: es-atlas / IGN. Cartografía: Esri y OpenStreetMap, con créditos visibles. Cumbres heredadas del mapa original; no representan perímetros de las sierras.

## Uso

Aplicación estática sin compilación. Servir por HTTPS (por ejemplo GitHub Pages). Publicar únicamente `index.html`, `weather.js`, `weather.css`, `sw.js`, `manifest.webmanifest` e iconos. No publicar todo el directorio de trabajo.

En Android: menú del navegador, Instalar aplicación o Añadir a pantalla de inicio. En iPhone: Compartir, Añadir a pantalla de inicio. La disponibilidad y presentación de instalación dependen del navegador. Sin conexión se conserva la estructura y la previsión guardada; los mapas externos no están disponibles.

## Arquitectura

`index.html` conserva el atlas Leaflet y contiene la pantalla meteorológica. `weather.js` obtiene, valida y presenta las previsiones. `weather.css` adapta las pantallas a fondos claros. `sw.js` mantiene la estructura local; no intercepta peticiones a proveedores externos. No hay servidor, cuenta de usuario ni base de datos.

## Historial

- 0.1.0: importación del atlas y primera integración meteorológica, humedad, resumen, horas, 15 días, Windy e instalación móvil.
