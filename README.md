# DALOG Diagnostic Report Manager

## Descripción
Este proyecto es una aplicación frontend para gestionar reportes diagnósticos.  
Hace parte de un challenge técnico, por lo que todas las interacciones con backend están simuladas.

La idea principal fue enfocarme en arquitectura, manejo de estado, accesibilidad y testing, más que en integrar un backend real.
---
## Tecnologías utilizadas
- React + TypeScript
- Zustand para manejo de estado
- Vite
- Vitest + React Testing Library
- CSS simple (sin librerías UI pesadas)

---

## Cómo ejecutar el proyecto
1. Instalar dependencias:
   - `npm install`
2. Ejecutar en desarrollo:
   - `npm run dev`
3. Ejecutar tests:
   - `npm run test`
4. Build de producción:
   - `npm run build`

---

## Arquitectura (visión general)

Traté de mantener la aplicación lo más simple posible, pero con una estructura que pueda escalar.

- Separé el estado en dos stores:
  - `reportStore`: manejo de reportes, búsqueda y carga inicial.
  - `uploadStore`: estado del upload (loading, success, error).

- Los servicios están desacoplados del resto de la app:
  - `reportService` simula el GET inicial.
  - `uploadService` simula el POST con delay.

- Usé un pequeño mapper (`ReportDTO → Report`) para no acoplar el modelo interno al formato del mock.

- También agregué persistencia básica con `localStorage` para no perder los datos al recargar.

- La estructura está organizada por features para que sea fácil de crecer.

---

## Decisiones técnicas

Algunas decisiones que tomé:

- El upload es determinístico (no uso `Math.random`), para evitar comportamientos inconsistentes y facilitar testing.
- Separé los stores para evitar que la lógica de reportes y upload se mezclen.
- Definí una capa simple de API (`ReportApi`) para que cambiar a un backend real sea directo.

---

## Performance

No hay optimizaciones complejas, pero sí lo básico:

- `useMemo` para el filtrado de reportes
- `useCallback` en handlers importantes
- `memo` en componentes de lista

La idea fue evitar renders innecesarios sin sobrecomplicar el código.

---

## Accesibilidad

- Uso de botón nativo para selección de archivos
- Navegación por teclado funcionando correctamente
- Mensajes de estado con `aria-live` (upload, error, éxito)

---

## Escalabilidad

Si esto fuera un sistema real y los archivos fueran grandes (por ejemplo >1GB), lo manejaría así:

- Subida por partes (chunked upload)
- Uso de presigned URLs (por ejemplo con S3)
- Streaming para no cargar todo en memoria
- Backend encargado de coordinar la subida y validar los chunks

---

## Testing

Se cubren los flujos principales:

- Búsqueda de reportes
- Upload exitoso
- Upload con error

La idea fue probar comportamiento (lo que ve el usuario) y no tanto detalles internos.
