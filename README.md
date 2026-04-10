# DALOG Diagnostic Report Manager

## Descripción
Aplicación frontend para gestionar reportes diagnósticos en un contexto de challenge técnico.  
El objetivo es demostrar buenas prácticas en arquitectura, accesibilidad, rendimiento y testing, usando APIs mock en lugar de backend real.

## Tecnologías utilizadas
- React + TypeScript
- Zustand
- Vite
- Vitest + React Testing Library
- CSS simple (sin framework UI pesado)

## Cómo ejecutar el proyecto
1. Instalar dependencias:
   - `npm install`
2. Ejecutar en desarrollo:
   - `npm run dev`
3. Ejecutar tests:
   - `npm run test`
4. Build de producción:
   - `npm run build`

## Arquitectura
- **Stores separados:**  
  - `reportStore`: reportes, búsqueda, carga inicial y `addReport`.  
  - `uploadStore`: estado de upload (`idle/loading/success/error`) y mensajes.
- **Servicios mock:**  
  - `reportService` para obtener reportes (dataset inicial del challenge en `ReportDTO`, mapeado a `Report`).  
  - `uploadService` para simular subida con delay.
- **DTO + mapper:** `ReportDTO` refleja el contrato del API; `mapReportDtoToReport` normaliza al modelo interno.
- **Persistencia local:** `localStorage` guarda la lista de reportes y tiene prioridad sobre la carga mock al iniciar.
- **Organización por features:**  
  - componentes y hooks agrupados por dominio (`reports`).
- **Separación lógica vs UI:**  
  - lógica de estado y efectos en stores/services; componentes enfocados en render e interacción.

## Decisiones técnicas clave
- **Upload determinístico:** se eliminó `Math.random` y se usa `shouldFail` en el servicio para comportamiento predecible y testeable.
- **Estado separado:** dividir `reportStore` y `uploadStore` reduce acoplamiento y facilita evolución de cada flujo.
- **Capa API (`ReportApi`):** define contratos claros para reemplazar mocks por backend real sin romper componentes.

## Performance
- Uso de `memo` en componentes de lista para reducir renders innecesarios.
- Uso de `useMemo` en filtrado de reportes para evitar cómputo repetido.
- Uso de `useCallback` en handlers críticos para mantener referencias estables.
- Selectores + `shallow` en Zustand para minimizar renders por cambios no relacionados.

## Accesibilidad (A11y)
- Uso de **botón nativo** para seleccionar archivo (en lugar de `div role="button"`).
- Navegación por teclado (Tab/Enter/Espacio) soportada por controles nativos.
- Mensajes de estado conectados con `aria-live` para anunciar carga, éxito y error.
- Estructura semántica con secciones y encabezados claros.

## Escalabilidad
### ¿Cómo escalar si los archivos fueran mayores a 1GB?
- **Chunked upload:** dividir el archivo en partes para reintentos parciales.
- **Streaming:** enviar datos progresivamente sin cargar todo en memoria.
- **Presigned URLs (S3 o similar):** subir directo a storage desde cliente.
- **Backend handling:** orquestar sesiones de multipart upload, validación, reconciliación de chunks y callbacks de estado.

## Testing
Se cubren comportamientos críticos:
- Búsqueda de reportes y filtrado en tiempo real.
- Flujo de upload exitoso: estado de carga, estado de éxito y alta en lista.
- Flujo de error de upload con `shouldFail=true`.

Estos tests validan la experiencia de usuario y la confiabilidad del flujo principal, evitando depender de detalles internos de implementación.

## 🔍 Posibles mejoras futuras
- Implementación de reintentos (retry) en uploads fallidos.
- Soporte para múltiples cargas concurrentes.
- Integración con un backend real.
- Paginación o virtualización para grandes volúmenes de datos.
