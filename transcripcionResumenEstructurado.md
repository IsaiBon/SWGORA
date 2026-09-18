# Transcripción Estructurada de la Reunión

**Archivo:** [`Desktop 2026.08.19 - 14.44.38.06 - Trim.mp4`](file:///C:/Users/luisb/Downloads/Desktop%202026.08.19%20-%2014.44.38.06%20-%20Trim.mp4)  
**Duración:** 37 minutos y 1 segundo  
**Archivo de texto completo:** [`transcripcion.txt`](file:///C:/Users/luisb/Downloads/transcripcion.txt)

---

## 📌 Resumen de Requerimientos Identificados en la Reunión

### 1. Módulo de Catálogos de Repuestos y Búsqueda Dimensional (Adaptadores)
* **Problema actual:** La empresa rectificadora maneja múltiples catálogos de repuestos en formato PDF (Dokuro, Rik, NPR, Pioneer, NDC, etc.), lo cual dificulta la búsqueda rápida.
* **Búsqueda por Vehículo/Motor:**
  * Filtro por Fabricante (ej. *Toyota*), Modelo y Código de Motor (ej. *3L* o *Nissan Z24*).
  * Debe mostrar los códigos de equivalencia entre fabricantes originales (OEM) y marcas alternas (Rik, NPR, NDC, etc.).
* **Búsqueda por Medidas / Dimensiones (para Adaptaciones):**
  * Si llega una pieza sin código de motor legible (ej. culatas marcadas como "NE"), debe permitir buscar por dimensiones físicas:
    * **Sellos de válvula / Ajuste de válvula:** Diámetro interno, diámetro externo, altura.
    * **Válvulas de motor:** Diámetro de hongo, vástago y altura total.
    * **Anillos de pistón:** Diámetro del cilindro/anillo (ej. 96mm, 75mm), altura/grosor del 1er anillo, 2do anillo y anillo de aceite.
    * **Pernos / Tornillos de culata:** Diámetro de rosca y longitud.
    * **Casquetería (Cojinetes NDC):** Medidas de casquete de bancada (`MS`), biela (`CB`), arandela de empuje (`TW`), leva (`SH`), bocina (`PB`).
* **Búsqueda Inversa:** Al ingresar un código de parte (ej. `28006`), desplegar medidas, descripción y vehículos compatibles.
* **Creación Dinámica de Grupos:** El administrador debe poder crear nuevos grupos de piezas (ej. *Camisas*) definiendo sus parámetros (ej. diámetro interno/externo, altura, con/sin pestaña).
* **Soporte Multimedia:** Visualización de imágenes/diagramas y especificaciones técnicas de cada repuesto.

---

### 2. Módulo de Órdenes de Trabajo y Cotizaciones
* **Campos del formulario:**
  * Datos generales: Fecha (día/mes/año), número correlativo de orden, cliente / tallerista, teléfono, dirección, marca del vehículo, modelo de motor, estado (pendiente / en proceso), eslogan.
  * Autocompletado / búsqueda rápida de clientes y marcas de motor para agilizar el llenado.
  * Secciones de operaciones de rectificación clasificadas por componentes del motor:
    1. **Bielas**
    2. **Bancadas**
    3. **Cigüeñal**
    4. **Culata**
    5. **Block**
  * Sección de **Repuestos** facturados al cliente.
  * **Precios:** Ingreso manual de precios para mano de obra (los costos varían según cliente, procedencia o complejidad).
  * **Total calculado automáticamente.**
* **Generación de Documentos / Reportes:**
  * **Cotización:** Formato en blanco y negro con marca de agua `"COTIZACIÓN"` al fondo o en el encabezado.
  * **Orden de Taller / Trabajo:** Formato formal con el diseño y colores corporativos (azul).
  * **Impresión limpia:** Al exportar/imprimir, solo deben aparecer las operaciones y repuestos efectivamente facturados, ocultando campos vacíos.
  * **Historial y Estadísticas:** Filtros por fecha/mes/año y por tallerista para consultar volumen de trabajo recibido (ej. cantidad de motores o culatas procesadas por cliente).

---

### 3. Aspectos Generales del Sistema
* **Plataforma:** Aplicación Web accesible desde cualquier navegador (PCs y dispositivos móviles).
* **Control de Acceso:** Roles diferenciados (Administrador y Usuarios de taller).

---

## 📝 Transcripción Literal con Marcas de Tiempo

La transcripción completa y detallada con todas las intervenciones y marcas de tiempo está guardada en:  
👉 [`transcripcion.txt`](file:///C:/Users/luisb/Downloads/transcripcion.txt)
