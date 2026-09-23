const trello = require('./trello.cjs');

async function main() {
  const boardId = '6a877dc08f12a90281254b3b';
  const firstListId = '6a877dc16ded9e444050ed75';
  const roadmapCardId = '6a9222558b696812d44e7973';

  console.log('1. Actualizando tarjeta de la semana en Roadmap...');
  await trello.updateCard(roadmapCardId, {
    name: '📅 Sprint 3: Corrección de Errores, Órdenes de Trabajo, Clientes y Dashboard',
    desc: `**Fase 2 | Jornada 3 (7 h) - Equipo de 4**
- **Arreglar errores**: Auditoría técnica, depuración y resolución de incidencias en flujos y consola.
- **Órdenes de trabajo**: Captura y cálculo reactivo de órdenes por componentes del motor (Bielas, Bancadas, Cigüeñal, Culata, Block).
- **Clientes**: Consolidación del CRUD, persistencia en Supabase (cédula, tipo, estado) y filtros de búsqueda.
- **Dashboard**: Métricas operativas en tiempo real, resumen de actividad y accesos directos de taller.`,
  });
  console.log('✔ Tarjeta de Roadmap actualizada con éxito.');

  console.log('2. Actualizando nombre de la primera columna a Sprint 3...');
  await trello.trelloFetch(`/lists/${firstListId}?name=${encodeURIComponent('📌 Sprint 3: Por Hacer (To Do)')}`, {
    method: 'PUT',
  });
  console.log('✔ Primera columna actualizada a: 📌 Sprint 3: Por Hacer (To Do)');

  console.log('3. Verificando o creando etiqueta Sprint 3...');
  const labels = await trello.trelloFetch(`/boards/${boardId}/labels`);
  let sprint3Label = labels.find((l) => l.name === 'Sprint 3 (Día 3)');
  if (!sprint3Label) {
    sprint3Label = await trello.trelloFetch(
      `/boards/${boardId}/labels?name=${encodeURIComponent('Sprint 3 (Día 3)')}&color=pink`,
      { method: 'POST' }
    );
    console.log('✔ Etiqueta creada:', sprint3Label.name);
  }

  const frontendLabel = labels.find((l) => l.name === 'Frontend Base');
  const backendLabel = labels.find((l) => l.name === 'Cloud & Backend');
  const uiuxLabel = labels.find((l) => l.name === 'UI/UX & Wireframes');
  const devopsLabel = labels.find((l) => l.name === 'DevOps & SDKs');

  const cardsToCreate = [
    {
      name: 'Depuración, Pruebas y Corrección de Errores',
      desc: `**Responsable:** Integrante 4 (DevOps & QA / Estabilidad)
**Tiempo estimado:** 7 horas (Jornada Sprint 3)

**Objetivo:** Auditar, depurar y resolver errores de consola, tipos en TypeScript, advertencias de rutas y fallos en las peticiones de datos.

**Entregable:** Aplicación completamente estable, sin errores de compilación ni advertencias en consola, con pruebas de flujo validadas.`,
      labelIds: [sprint3Label.id, devopsLabel?.id].filter(Boolean),
      checklists: [
        {
          name: 'Subtareas de la Jornada (7 horas)',
          items: [
            'Auditar y eliminar advertencias en la consola del navegador y terminal de Vite',
            'Resolver discrepancias de tipos de datos de TypeScript entre Supabase y componentes Vue',
            'Corregir sincronización del guardián de rutas (router.beforeEach) y redirecciones no autorizadas',
            'Validar persistencia de sesión y manejo de errores cuando no hay conexión de red',
            'Ejecutar verificación de compilación limpia con vue-tsc -b && vite build'
          ]
        }
      ]
    },
    {
      name: 'Módulo de Órdenes de Trabajo por Componentes',
      desc: `**Responsable:** Integrante 1 (Frontend Lead)
**Tiempo estimado:** 7 horas (Jornada Sprint 3)

**Objetivo:** Desarrollar el flujo y la interfaz reactiva para la creación y gestión de órdenes de rectificación segmentadas por componentes mecánicos.

**Entregable:** Pantalla de órdenes funcional con cabecera de taller, selección de bloques de motor y cálculo automático de totales.`,
      labelIds: [sprint3Label.id, frontendLabel?.id].filter(Boolean),
      checklists: [
        {
          name: 'Subtareas de la Jornada (7 horas)',
          items: [
            'Implementar formulario de cabecera: correlativo automático, fecha, datos vehiculares y cliente',
            'Maquetar bloques específicos de rectificación: Bielas, Bancadas, Cigüeñal, Culata y Block',
            'Permitir ingreso manual flexible de precios de mano de obra por cada operación',
            'Incorporar selector y búsqueda rápida de clientes/talleristas registrados',
            'Calcular y actualizar en tiempo real los totales de mano de obra y orden'
          ]
        }
      ]
    },
    {
      name: 'Gestión Integral y Persistencia de Clientes',
      desc: `**Responsable:** Integrante 2 (Database & Backend)
**Tiempo estimado:** 7 horas (Jornada Sprint 3)

**Objetivo:** Consolidar el CRUD de clientes y talleristas con persistencia en Supabase, migración de esquema y filtros avanzados.

**Entregable:** Módulo de clientes totalmente integrado con PostgreSQL, soporte para cédula/tipo/estado y eliminación lógica.`,
      labelIds: [sprint3Label.id, backendLabel?.id].filter(Boolean),
      checklists: [
        {
          name: 'Subtareas de la Jornada (7 horas)',
          items: [
            "Aplicar en Supabase la migración SQL con columnas 'cedula', 'tipo' y 'estado'",
            'Implementar borrado lógico (inactivación de clientes) para preservar historial de órdenes',
            'Conectar filtros de búsqueda por nombre, teléfono, cédula, tipo y estado',
            "Optimizar índices B-tree sobre 'cedula', 'tipo' y 'estado' en PostgreSQL",
            'Validar reglas de entrada: formato de teléfono, cédula única y requerimientos mínimos'
          ]
        }
      ]
    },
    {
      name: 'Dashboard Operativo y Métricas del Taller',
      desc: `**Responsable:** Integrante 3 (UI / UX Designer)
**Tiempo estimado:** 7 horas (Jornada Sprint 3)

**Objetivo:** Diseñar y construir el Dashboard interactivo con indicadores clave de rendimiento (KPIs), actividad reciente y accesos directos.

**Entregable:** Panel de control responsivo con métricas operativas del taller, tarjetas de estado y navegación rápida.`,
      labelIds: [sprint3Label.id, uiuxLabel?.id].filter(Boolean),
      checklists: [
        {
          name: 'Subtareas de la Jornada (7 horas)',
          items: [
            'Diseñar tarjetas KPI: total de órdenes activas, clientes registrados y servicios completados',
            'Construir sección de órdenes de trabajo recientes con etiquetas visuales de estado',
            'Implementar gráfico o desglose visual de servicios más demandados por componente',
            "Integrar botones de acción rápida: '+ Nueva Orden', '+ Nuevo Cliente' y 'Ver Catálogo'",
            'Asegurar adaptabilidad y contraste óptimo en tablets y computadoras de mostrador'
          ]
        }
      ]
    }
  ];

  console.log('4. Creando nuevas tarjetas en la primera columna...');
  for (const cardDef of cardsToCreate) {
    const createdCard = await trello.createCard(firstListId, cardDef.name, cardDef.desc);
    console.log(`✔ Tarjeta creada: "${createdCard.name}" (ID: ${createdCard.id})`);

    // Añadir etiquetas
    for (const labelId of cardDef.labelIds) {
      await trello.trelloFetch(`/cards/${createdCard.id}/idLabels?value=${labelId}`, { method: 'POST' });
    }

    // Añadir checklists y subtareas
    for (const cl of cardDef.checklists) {
      const createdCl = await trello.trelloFetch(`/cards/${createdCard.id}/checklists?name=${encodeURIComponent(cl.name)}`, {
        method: 'POST'
      });
      for (const item of cl.items) {
        await trello.trelloFetch(`/checklists/${createdCl.id}/checkItems?name=${encodeURIComponent(item)}`, {
          method: 'POST'
        });
      }
      console.log(`   └─ Checklist agregada: ${cl.name} (${cl.items.length} subtareas)`);
    }
  }

  console.log('\n¡Todas las tareas se sincronizaron con éxito en Trello!');
}

main().catch(console.error);
