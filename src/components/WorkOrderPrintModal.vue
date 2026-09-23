<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '@/services/ordersService'
import { Printer, X, FileText } from 'lucide-vue-next'

const props = defineProps<{
  order: Order | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isCotizacion = computed(() => props.order?.type === 'cotizacion')

const handlePrint = () => {
  window.print()
}

// Clean print: separar Mano de Obra y Repuestos Facturados limpiamente
const isValveTypeOperation = (opName: string) => {
  const lower = opName.toLowerCase()
  return (lower.includes('guías') || lower.includes('guias')) && (lower.includes('adapte') || lower.includes('válvula') || lower.includes('valvula'))
}

const billedOperations = computed(() => {
  return props.order?.operations.filter(op => op.category !== 'Repuestos' && op.quantity > 0 && op.unitPrice >= 0) || []
})

const billedParts = computed(() => {
  const opParts = (props.order?.operations || [])
    .filter(op => op.category === 'Repuestos' && op.quantity > 0 && op.unitPrice >= 0)
    .map(op => ({
      id: op.id,
      category: 'Repuestos',
      name: op.operation,
      code: undefined,
      quantity: op.quantity,
      unitPrice: op.unitPrice,
      subtotal: op.subtotal,
      measure: op.measure
    }))

  const regularParts = (props.order?.parts || []).filter(p => p.quantity > 0 && p.unitPrice >= 0)
  return [...opParts, ...regularParts]
})

const billedMaterials = computed(() => {
  return props.order?.materials.filter(m => m.quantity > 0 && m.unitPrice >= 0) || []
})
</script>

<template>
  <div v-if="isOpen && order" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
    <!-- Modal Card (En pantalla con sombra, en print ocupa toda la hoja) -->
    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 print:border-none print:shadow-none print:max-w-none print:w-full">
      <!-- Barra superior no imprimible -->
      <div class="px-6 py-4 bg-slate-800 text-white flex items-center justify-between print:hidden">
        <div class="flex items-center gap-2">
          <FileText class="w-5 h-5 text-cyan-400" />
          <span class="font-semibold text-sm">
            Vista Previa de Impresión - {{ isCotizacion ? 'Cotización' : 'Orden de Trabajo' }} {{ order.orderNumber }}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="handlePrint"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg shadow transition"
          >
            <Printer class="w-4 h-4" />
            Imprimir / Exportar PDF
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Hoja de Impresión limpia -->
      <div
        id="printable-work-order"
        :class="[
          'p-8 print:p-6 relative text-slate-800',
          isCotizacion ? 'watermark-cotizacion' : 'order-formal-theme'
        ]"
      >
        <!-- Marca de agua para cotizaciones -->
        <div v-if="isCotizacion" class="watermark-text select-none">
          COTIZACIÓN
        </div>

        <!-- Encabezado de Documento -->
        <div class="flex justify-between items-start border-b pb-6 mb-6 border-slate-200">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-white font-black', isCotizacion ? 'bg-slate-700' : 'bg-cyan-600']">
                JR
              </div>
              <div>
                <h1 class="text-xl font-bold text-slate-900 tracking-tight">JR BLANCO RECTIFICADORA</h1>
                <p class="text-xs text-slate-500">Precisión y Calidad en Reconstrucción de Motores</p>
              </div>
            </div>
            <p class="text-xs text-slate-500">
              Tel: +52 (81) 8345-9912 | Monterrey, N.L. México
            </p>
          </div>

          <div class="text-right">
            <span
              :class="[
                'inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-1',
                isCotizacion ? 'bg-slate-100 text-slate-800 border border-slate-300' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
              ]"
            >
              {{ isCotizacion ? 'DOCUMENTO DE COTIZACIÓN' : 'ORDEN DE TRABAJO TALLER' }}
            </span>
            <div class="text-2xl font-black text-slate-900">{{ order.orderNumber }}</div>
            <div class="text-xs text-slate-500">Fecha de ingreso: {{ order.date }}</div>
            <div v-if="order.deliveryDate" class="text-xs text-slate-500">Entrega estimada: {{ order.deliveryDate }}</div>
            <div class="text-xs font-semibold text-slate-700 mt-1">Estado: {{ order.status }}</div>
          </div>
        </div>

        <!-- Información de Cliente y Vehículo -->
        <div class="grid grid-cols-2 gap-6 mb-6 p-4 rounded-xl bg-slate-50 print:bg-transparent border border-slate-200">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Datos del Cliente</h3>
            <div class="text-sm font-bold text-slate-900">{{ order.customer || 'Cliente Mostrador' }}</div>
            <div v-if="order.workshop" class="text-xs text-slate-600"><strong>Taller:</strong> {{ order.workshop }}</div>
            <div v-if="order.customerPhone" class="text-xs text-slate-600"><strong>Teléfono:</strong> {{ order.customerPhone }}</div>
            <div v-if="order.customerAddress" class="text-xs text-slate-600"><strong>Dirección:</strong> {{ order.customerAddress }}</div>
          </div>

          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Datos del Vehículo / Motor</h3>
            <div class="text-sm font-bold text-slate-900">
              {{ [order.vehicleBrand, order.vehicleModel, order.vehicleYear].filter(Boolean).join(' - ') || 'Datos no especificados' }}
            </div>
            <div v-if="order.engineNumber" class="text-xs text-slate-600"><strong>N° Motor:</strong> {{ order.engineNumber }}</div>
            <div v-if="order.engineType" class="text-xs text-slate-600"><strong>Tipo Motor:</strong> {{ order.engineType }}</div>
            <div v-if="order.observations" class="text-xs text-slate-500 mt-1 italic"><strong>Obs:</strong> {{ order.observations }}</div>
          </div>
        </div>

        <!-- 1. Bloque de Operaciones de Rectificación (Mano de Obra) -->
        <div v-if="billedOperations.length > 0" class="mb-6">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-300">
            1. Servicios de Rectificación (Mano de Obra)
          </h3>
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-slate-300 text-slate-500 font-semibold text-left">
                <th class="py-1.5 w-24">Componente</th>
                <th class="py-1.5">Operación Realizada</th>
                <th class="py-1.5 text-center w-16">Cant.</th>
                <th class="py-1.5 text-right w-24">Precio Unit.</th>
                <th class="py-1.5 text-right w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="op in billedOperations" :key="op.id">
                <td class="py-1.5 font-bold text-slate-700">{{ op.category }}</td>
                <td class="py-1.5 text-slate-900">
                  <div class="font-medium">{{ op.operation }}</div>
                  <div v-if="op.measureBanco || op.measureBiela" class="text-[10px] text-cyan-900 font-semibold mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span v-if="op.measureBanco" class="inline-block bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2">
                      Banco: <strong>{{ op.measureBanco }}</strong>
                    </span>
                    <span v-if="op.measureBiela" class="inline-block bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2">
                      Biela: <strong>{{ op.measureBiela }}</strong>
                    </span>
                  </div>
                  <div v-else-if="op.measure" class="text-[10px] text-cyan-900 font-semibold mt-0.5">
                    <span class="inline-block bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2">
                      {{ isValveTypeOperation(op.operation) ? 'Tipo:' : 'Medida:' }} <strong>{{ op.measure }}</strong>
                    </span>
                  </div>
                </td>
                <td class="py-1.5 text-center">{{ op.quantity }}</td>
                <td class="py-1.5 text-right">${{ op.unitPrice.toFixed(2) }}</td>
                <td class="py-1.5 text-right font-semibold text-slate-900">${{ op.subtotal.toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-slate-300">
                <td colspan="4" class="py-1.5 text-right font-bold text-slate-700">Subtotal Mano de Obra:</td>
                <td class="py-1.5 text-right font-bold text-slate-900">${{ order.laborTotal.toFixed(2) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- 2. Bloque de Repuestos Facturados (Si existen) -->
        <div v-if="billedParts.length > 0" class="mb-6">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-300">
            2. Repuestos y Componentes Facturados
          </h3>
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-slate-300 text-slate-500 font-semibold text-left">
                <th class="py-1.5 w-24">Categoría</th>
                <th class="py-1.5">Descripción / Código</th>
                <th class="py-1.5 text-center w-16">Cant.</th>
                <th class="py-1.5 text-right w-24">Precio Unit.</th>
                <th class="py-1.5 text-right w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="part in billedParts" :key="part.id">
                <td class="py-1.5 text-slate-600">{{ part.category }}</td>
                <td class="py-1.5 text-slate-900 font-medium">
                  {{ part.name }} <span v-if="part.code" class="text-slate-400 text-[10px]">({{ part.code }})</span>
                  <span v-if="part.measure" class="ml-1.5 inline-block bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 text-[10px] text-cyan-900 font-bold">
                    {{ part.measure }}
                  </span>
                </td>
                <td class="py-1.5 text-center">{{ part.quantity }}</td>
                <td class="py-1.5 text-right">${{ part.unitPrice.toFixed(2) }}</td>
                <td class="py-1.5 text-right font-semibold text-slate-900">${{ part.subtotal.toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-slate-300">
                <td colspan="4" class="py-1.5 text-right font-bold text-slate-700">Subtotal Repuestos:</td>
                <td class="py-1.5 text-right font-bold text-slate-900">${{ order.partsTotal.toFixed(2) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- 3. Bloque de Materiales / Insumos (Si existen) -->
        <div v-if="billedMaterials.length > 0" class="mb-6">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 pb-1 border-b border-slate-300">
            3. Materiales e Insumos de Taller
          </h3>
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-slate-300 text-slate-500 font-semibold text-left">
                <th class="py-1.5">Descripción</th>
                <th class="py-1.5 text-center w-16">Cant.</th>
                <th class="py-1.5 text-right w-24">Precio Unit.</th>
                <th class="py-1.5 text-right w-24">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="mat in billedMaterials" :key="mat.id">
                <td class="py-1.5 text-slate-900">{{ mat.name }}</td>
                <td class="py-1.5 text-center">{{ mat.quantity }}</td>
                <td class="py-1.5 text-right">${{ mat.unitPrice.toFixed(2) }}</td>
                <td class="py-1.5 text-right font-semibold text-slate-900">${{ mat.subtotal.toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-slate-300">
                <td colspan="3" class="py-1.5 text-right font-bold text-slate-700">Subtotal Materiales:</td>
                <td class="py-1.5 text-right font-bold text-slate-900">${{ order.materialsTotal.toFixed(2) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Resumen de Totales y Firmas -->
        <div class="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-end">
          <div class="text-xs text-slate-500 max-w-sm">
            <p class="font-semibold text-slate-700 mb-1">Términos y Condiciones:</p>
            <p>Garantía de mano de obra de 90 días contra defectos de maquinado. No incluye piezas sometidas a sobrecalentamiento o falta de lubricación.</p>
            <div class="mt-8 pt-6 border-t border-slate-300 w-48 text-center text-slate-600 font-medium">
              Firma de Conformidad
            </div>
          </div>

          <div class="w-64 bg-slate-50 print:bg-transparent p-4 rounded-xl border border-slate-200">
            <div class="flex justify-between text-xs py-1">
              <span class="text-slate-600">Subtotal Mano de Obra:</span>
              <span class="font-semibold">${{ order.laborTotal.toFixed(2) }}</span>
            </div>
            <div v-if="order.materialsTotal > 0" class="flex justify-between text-xs py-1">
              <span class="text-slate-600">Subtotal Materiales:</span>
              <span class="font-semibold">${{ order.materialsTotal.toFixed(2) }}</span>
            </div>
            <div v-if="order.partsTotal > 0" class="flex justify-between text-xs py-1">
              <span class="text-slate-600">Subtotal Repuestos:</span>
              <span class="font-semibold">${{ order.partsTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-base font-black py-2 mt-2 border-t-2 border-slate-900 text-slate-900">
              <span>TOTAL GENERAL:</span>
              <span :class="isCotizacion ? 'text-slate-900' : 'text-cyan-700'">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Marca de agua solo para cotizaciones */
.watermark-cotizacion {
  position: relative;
}
.watermark-text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 80px;
  font-weight: 900;
  color: rgba(100, 116, 139, 0.08);
  pointer-events: none;
  z-index: 0;
  letter-spacing: 0.15em;
}

@media print {
  body {
    background: white !important;
  }
  body * {
    visibility: hidden;
  }
  #printable-work-order,
  #printable-work-order * {
    visibility: visible;
  }
  #printable-work-order {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 1.5rem !important;
  }
  .watermark-text {
    color: rgba(0, 0, 0, 0.06) !important;
  }
  .print\:p-0 {
    padding: 0 !important;
  }
  .print\:bg-white {
    background-color: white !important;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>
