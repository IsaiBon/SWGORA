<template>
  <div class="clients-page">

    <!-- =========================
         ENCABEZADO
    ========================== -->
    <header class="page-header">
      <div class="title-section">
        <div class="title-icon">
          <span class="material-symbols-outlined">person</span>
        </div>

        <div>
          <h1>Clientes</h1>
          <p>Administra la información de tus clientes y talleristas.</p>
        </div>
      </div>

      <div class="header-actions">
        <button class="notification-button">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-dot"></span>
        </button>

        <div class="admin-info">
          <div class="admin-avatar">AD</div>

          <div class="admin-text">
            <strong>Administrador</strong>
            <span>admin@taller.com</span>
          </div>

          <span class="material-symbols-outlined arrow">
            keyboard_arrow_down
          </span>
        </div>
      </div>
    </header>

    <!-- =========================
         CONTENIDO
    ========================== -->
    <section class="page-content">

      <!-- BUSCADOR Y FILTROS -->
      <div class="filters-card">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>

          <input
            v-model="search"
            type="text"
            placeholder="Buscar por nombre, teléfono o cédula..."
          />
        </div>

        <div class="select-wrapper">
          <select v-model="typeFilter">
            <option value="">Tipo de cliente</option>
            <option value="Cliente">Cliente</option>
            <option value="Tallerista">Tallerista</option>
        </select>

          <span class="material-symbols-outlined">
            keyboard_arrow_down
          </span>
        </div>

        <div class="select-wrapper status-select">
          <select v-model="statusFilter">
            <option value="">Estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
        </select>

          <span class="material-symbols-outlined">
            keyboard_arrow_down
          </span>
        </div>

        <button
          type="button"
          class="new-client-button"
          :disabled="saving"
          @click="openCreateModal"
        >
          <span class="material-symbols-outlined">add</span>
          Nuevo cliente
        </button>
      </div>

      <!-- =========================
           TABLA
      ========================== -->
      <div class="table-card">

        <div class="table-header">
          <div class="table-title">
            <span class="material-symbols-outlined">group</span>
            <h2>Listado de clientes ({{ filteredClients.length }})</h2>
          </div>

          <div class="updated">
            <span class="material-symbols-outlined">refresh</span>
            <span>Actualizado hace unos segundos</span>
          </div>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando clientes...</p>
        </div>

        <!-- TABLA -->
        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th class="actions-column">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="cliente in filteredClients"
                :key="cliente.id"
              >
                <!-- NOMBRE -->
                <td>
                  <div class="client-name">
                    <div
                      class="client-avatar"
                      :class="cliente.avatarClass"
                    >
                      {{ cliente.iniciales }}
                    </div>

                    <div class="client-data">
                      <strong>{{ cliente.nombre }}</strong>
                      <span>Cédula: {{ cliente.cedula }}</span>
                    </div>
                  </div>
                </td>

                <!-- TELÉFONO -->
                <td class="phone">
                  {{ cliente.telefono }}
                </td>

                <!-- TIPO -->
                <td>
                  <span
                    class="badge"
                    :class="
                      cliente.tipo === 'Tallerista'
                        ? 'badge-workshop'
                        : 'badge-client'
                    "
                  >
                    {{ cliente.tipo }}
                  </span>
                </td>

                <!-- DIRECCIÓN -->
                <td class="address">
                  {{ cliente.direccion }}
                </td>

                <!-- ESTADO -->
                <td>
                  <span
                    class="badge"
                    :class="
                      cliente.estado === 'Activo'
                        ? 'badge-active'
                        : 'badge-inactive'
                    "
                  >
                    {{ cliente.estado }}
                  </span>
                </td>

                <!-- ACCIONES -->
                <td>
                  <div class="actions">
                    <button
                      type="button"
                      class="action-button edit"
                      :disabled="saving"
                      title="Editar cliente"
                      @click="openEdit(cliente)"
                    >
                      <span class="material-symbols-outlined">
                        edit
                      </span>
                    </button>

                    <button
                      type="button"
                      class="action-button delete"
                      :class="{ disabled: cliente.estado === 'Inactivo' }"
                      :disabled="cliente.estado === 'Inactivo'"
                      :title="cliente.estado === 'Inactivo' ? 'Cliente inactivo' : 'Inactivar cliente'"
                      @click="askDelete(cliente)"
                    >
                      <span class="material-symbols-outlined">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
  v-if="filteredClients.length === 0"
  class="no-results"
>
  <span class="material-symbols-outlined">
    person_search
  </span>

  <strong>No se encontraron clientes</strong>

  <p>
    Intenta cambiar el término de búsqueda o los filtros.
  </p>
</div>
        </div>

        <!-- FOOTER TABLA -->
        <div v-if="!loading" class="table-footer">

          <div class="records-per-page">
            <span>Mostrar</span>

            <select>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>

            <span>registros por página</span>
          </div>

          <div class="pagination">
            <button class="page-arrow">
              <span class="material-symbols-outlined">
                chevron_left
              </span>
            </button>

            <button class="page-number active">1</button>
            <button class="page-number">2</button>
            <button class="page-number">3</button>

            <button class="page-arrow">
              <span class="material-symbols-outlined">
                chevron_right
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>

    <ClientModal
      :open="clientModalOpen"
      :mode="modalMode"
      :client="selectedClient"
      @close="closeClientModal"
      @save="handleSaveClient"
    />

    <Teleport to="body">
      <Transition name="confirm">
        <div
          v-if="deleteDialog"
          class="delete-overlay"
          @mousedown.self="closeDeleteDialog"
        >
          <div class="delete-modal" role="dialog" aria-modal="true">
            <button
              type="button"
              class="delete-close"
              aria-label="Cerrar"
              @click="closeDeleteDialog"
            >
              <span class="material-symbols-outlined">close</span>
            </button>

            <div class="delete-icon">
              <span class="material-symbols-outlined">person_off</span>
            </div>

            <h3>¿Inactivar cliente?</h3>

            <p>
              <strong>{{ clientToDelete?.nombre }}</strong> pasará a estado
              <strong>Inactivo</strong>. El registro se conservará en el sistema.
            </p>

            <div class="delete-actions">
              <button
                type="button"
                class="delete-cancel"
                @click="closeDeleteDialog"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="delete-confirm"
                :disabled="saving"
                @click="confirmDelete"
              >
                <span class="material-symbols-outlined">person_off</span>
                {{ saving ? 'Procesando...' : 'Inactivar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast.visible"
          class="toast-message"
          :class="`toast-${toast.type}`"
          role="status"
          aria-live="polite"
        >
          <div class="toast-icon">
            <span class="material-symbols-outlined">
              {{ toast.type === 'success' ? 'check_circle' : 'error' }}
            </span>
          </div>

          <div class="toast-content">
            <strong>{{ toast.type === 'success' ? 'Operación exitosa' : 'Ocurrió un error' }}</strong>
            <span>{{ toast.message }}</span>
          </div>

          <button
            type="button"
            class="toast-close"
            aria-label="Cerrar notificación"
            @click="hideToast"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ClientModal, { type NewClient } from '@/components/ClientModal.vue'
import {
  clientService,
  type Client,
  type ClientInput
} from '@/services/clientService'

interface Cliente extends Client {
  iniciales: string
  avatarClass: string
}

const loading = ref(true)
const saving = ref(false)
const clientModalOpen = ref(false)
const search = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const selectedClient = ref<Cliente | null>(null)
const modalMode = ref<'create' | 'edit'>('create')
const deleteDialog = ref(false)
const clientToDelete = ref<Cliente | null>(null)
const clientes = ref<Cliente[]>([])

type ToastType = 'success' | 'error'

const toast = ref<{
  visible: boolean
  type: ToastType
  message: string
}>({
  visible: false,
  type: 'success',
  message: ''
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(type: ToastType, message: string) {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toast.value = {
    visible: true,
    type,
    message
  }

  toastTimer = setTimeout(() => {
    toast.value.visible = false
    toastTimer = null
  }, 3500)
}

function hideToast() {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }

  toast.value.visible = false
}

const avatarClasses = [
  'avatar-purple',
  'avatar-yellow',
  'avatar-pink',
  'avatar-orange',
  'avatar-green',
  'avatar-blue'
]

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

function getAvatarClass(id: string) {
  let hash = 0

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash + id.charCodeAt(index)) % avatarClasses.length
  }

  return avatarClasses[hash]
}

function mapClient(client: Client): Cliente {
  return {
    ...client,
    iniciales: getInitials(client.nombre),
    avatarClass: getAvatarClass(client.id)
  }
}

async function loadClients() {
  loading.value = true

  try {
    const data = await clientService.getClients()
    clientes.value = data.map(mapClient)
  } catch (error) {
    console.error('[ClientesView] No se pudieron cargar los clientes:', error)
    clientes.value = []
    showToast('error', 'No se pudieron cargar los clientes. Intenta nuevamente.')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  modalMode.value = 'create'
  selectedClient.value = null
  clientModalOpen.value = true
}

function openEdit(cliente: Cliente) {
  modalMode.value = 'edit'
  selectedClient.value = { ...cliente }
  clientModalOpen.value = true
}

function closeClientModal() {
  clientModalOpen.value = false
  selectedClient.value = null
  modalMode.value = 'create'
}

function toClientInput(client: NewClient): ClientInput {
  return {
    nombre: client.nombre,
    cedula: client.cedula,
    telefono: client.telefono,
    tipo: client.tipo,
    direccion: client.direccion
  }
}

async function handleSaveClient(client: NewClient) {
  if (saving.value) return

  saving.value = true

  try {
    if (modalMode.value === 'edit' && selectedClient.value) {
      const updated = await clientService.updateClient(
        selectedClient.value.id,
        toClientInput(client)
      )

      const index = clientes.value.findIndex(
        (item) => item.id === updated.id
      )

      if (index !== -1) {
        clientes.value[index] = mapClient(updated)
      }

      closeClientModal()
      showToast('success', 'Los datos del cliente se actualizaron correctamente.')
      return
    }

    const created = await clientService.createClient(toClientInput(client))
    clientes.value.unshift(mapClient(created))
    closeClientModal()
    showToast('success', 'El cliente se registró correctamente.')
  } catch (error) {
    console.error('[ClientesView] No se pudo guardar el cliente:', error)
    showToast('error', 'No se pudo guardar el cliente. Intenta nuevamente.')
  } finally {
    saving.value = false
  }
}

function askDelete(cliente: Cliente) {
  if (cliente.estado === 'Inactivo' || saving.value) return

  clientToDelete.value = cliente
  deleteDialog.value = true
}

function closeDeleteDialog() {
  if (saving.value) return

  deleteDialog.value = false
  clientToDelete.value = null
}

async function confirmDelete() {
  if (!clientToDelete.value || saving.value) return

  saving.value = true

  try {
    const updated = await clientService.deactivateClient(
      clientToDelete.value.id
    )

    const index = clientes.value.findIndex(
      (item) => item.id === updated.id
    )

    if (index !== -1) {
      clientes.value[index] = mapClient(updated)
    }

    deleteDialog.value = false
    clientToDelete.value = null
    showToast('success', 'El cliente fue inactivado correctamente.')
  } catch (error) {
    console.error('[ClientesView] No se pudo inactivar el cliente:', error)
    showToast('error', 'No se pudo inactivar el cliente. Intenta nuevamente.')
  } finally {
    saving.value = false
  }
}

const filteredClients = computed(() => {
  const term = search.value.trim().toLowerCase()

  return clientes.value.filter((cliente) => {
    const matchesSearch =
      !term ||
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.telefono.toLowerCase().includes(term) ||
      cliente.cedula.toLowerCase().includes(term)

    const matchesType =
      !typeFilter.value ||
      cliente.tipo === typeFilter.value

    const matchesStatus =
      !statusFilter.value ||
      cliente.estado === statusFilter.value

    return matchesSearch && matchesType && matchesStatus
  })
})

onMounted(() => {
  void loadClients()
})
</script>

<style scoped>
/* =====================================================
   PÁGINA
===================================================== */

.clients-page {
  min-height: 100vh;
  color: #253342;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* =====================================================
   HEADER
===================================================== */

.page-header {
  min-height: 104px;
  padding: 24px 36px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid #edf1f4;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: #e2f8fa;
  color: #08aebd;
}

.title-icon .material-symbols-outlined {
  font-size: 28px;
  font-variation-settings: 'FILL' 1;
}

.title-section h1 {
  margin: 0 0 4px;

  font-size: 26px;
  line-height: 1.1;
  font-weight: 700;

  color: #253342;
}

.title-section p {
  margin: 0;

  font-size: 13px;
  color: #8a97a5;
}

/* ADMIN */

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.notification-button {
  position: relative;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;

  color: #6d7b89;

  cursor: pointer;
}

.notification-button .material-symbols-outlined {
  font-size: 23px;
}

.notification-dot {
  position: absolute;

  top: 5px;
  right: 6px;

  width: 7px;
  height: 7px;

  border: 2px solid white;
  border-radius: 50%;

  background: #ff5c63;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;
}

.admin-avatar {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #e1f7fa;
  color: #08a9b7;

  font-size: 12px;
  font-weight: 700;
}

.admin-text {
  display: flex;
  flex-direction: column;

  line-height: 1.3;
}

.admin-text strong {
  font-size: 12px;
  color: #33414e;
}

.admin-text span {
  font-size: 10px;
  color: #9aa5af;
}

.arrow {
  color: #87929d;
  font-size: 20px;
}

/* =====================================================
   CONTENIDO
===================================================== */

.page-content {
  padding: 25px 36px 45px;
}

/* =====================================================
   FILTROS
===================================================== */

.filters-card {
  width: 100%;
  min-height: 92px;

  padding: 20px 22px;

  display: grid;
  grid-template-columns:
    minmax(300px, 1fr)
    190px
    155px
    160px;

  align-items: center;
  gap: 15px;

  background: white;

  border: 1px solid #edf1f3;
  border-radius: 8px;

  box-shadow: 0 2px 7px rgba(36, 55, 70, 0.04);
}

/* BUSCADOR */

.search-box {
  height: 44px;

  display: flex;
  align-items: center;

  border: 1px solid #dfe6eb;
  border-radius: 6px;

  background: #fff;

  transition: border 0.2s ease;
}

.search-box:focus-within {
  border-color: #0ab2bf;
}

.search-box .material-symbols-outlined {
  margin-left: 15px;

  color: #9aa6b1;
  font-size: 20px;
}

.search-box input {
  width: 100%;
  height: 100%;

  padding: 0 14px 0 10px;

  border: none;
  outline: none;

  background: transparent;

  font-size: 12px;
  color: #42505d;
}

.search-box input::placeholder {
  color: #a4adb6;
}

/* SELECTS */

.select-wrapper {
  position: relative;

  height: 44px;
}

.select-wrapper select {
  appearance: none;

  width: 100%;
  height: 100%;

  padding: 0 40px 0 14px;

  border: 1px solid #dfe6eb;
  border-radius: 6px;

  outline: none;
  background: white;

  color: #7a8793;

  font-size: 12px;

  cursor: pointer;
}

.select-wrapper > span {
  position: absolute;

  top: 50%;
  right: 11px;

  transform: translateY(-50%);

  pointer-events: none;

  color: #8b97a2;
  font-size: 20px;
}

/* BOTÓN NUEVO */

.new-client-button {
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 0 18px;

  border: none;
  border-radius: 6px;

  background: #09afbd;
  color: white;

  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  box-shadow: 0 3px 8px rgba(9, 175, 189, 0.16);

  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.new-client-button:hover {
  background: #079fac;
}

.new-client-button:active {
  transform: scale(0.98);
}

.new-client-button .material-symbols-outlined {
  font-size: 18px;
}

/* =====================================================
   TARJETA DE TABLA
===================================================== */

.table-card {
  margin-top: 18px;

  overflow: hidden;

  background: white;

  border: 1px solid #edf1f3;
  border-radius: 8px;

  box-shadow: 0 2px 7px rgba(36, 55, 70, 0.04);
}

.table-header {
  height: 64px;

  padding: 0 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #edf1f3;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-title .material-symbols-outlined {
  color: #0aaebb;
  font-size: 22px;
  font-variation-settings: 'FILL' 1;
}

.table-title h2 {
  margin: 0;

  color: #374451;

  font-size: 14px;
  font-weight: 700;
}

.updated {
  display: flex;
  align-items: center;
  gap: 6px;

  color: #9aa5af;

  font-size: 10px;
}

.updated .material-symbols-outlined {
  font-size: 15px;
}

/* =====================================================
   TABLA
===================================================== */

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 900px;

  border-collapse: collapse;
}

thead {
  background: #f7f9fa;
}

th {
  height: 44px;

  padding: 0 22px;

  text-align: left;

  color: #8c98a3;

  font-size: 10px;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 0.3px;

  border-bottom: 1px solid #edf1f3;
}

td {
  height: 61px;

  padding: 7px 22px;

  color: #677481;

  font-size: 11px;

  border-bottom: 1px solid #f0f2f4;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #fbfdfe;
}

/* NOMBRE */

.client-name {
  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 180px;
}

.client-avatar {
  width: 34px;
  height: 34px;
  min-width: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  font-size: 10px;
  font-weight: 700;
}

.client-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.client-data strong {
  color: #3d4a57;

  font-size: 11px;
  font-weight: 600;
}

.client-data span {
  color: #a0aab3;

  font-size: 9px;
}

.phone {
  color: #5d6b78;
}

.address {
  max-width: 190px;

  color: #7b8792;
}

/* AVATARES */

.avatar-purple {
  background: #eee6ff;
  color: #7d61d8;
}

.avatar-yellow {
  background: #fff2d5;
  color: #d69a2d;
}

.avatar-pink {
  background: #ffe5ef;
  color: #d86b93;
}

.avatar-orange {
  background: #ffe8d7;
  color: #df8550;
}

.avatar-green {
  background: #def5e9;
  color: #4eaa79;
}

.avatar-blue {
  background: #e0f2ff;
  color: #579bc7;
}

/* BADGES */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 58px;
  height: 21px;

  padding: 0 9px;

  border-radius: 5px;

  font-size: 9px;
  font-weight: 600;
}

.badge-client {
  background: #e0f5f7;
  color: #1999a4;
}

.badge-workshop {
  background: #fff0dc;
  color: #c68b40;
}

.badge-active {
  background: #e2f7eb;
  color: #399967;
}

.badge-inactive {
  background: #ffe5e5;
  color: #d76868;
}

/* ACCIONES */

.actions-column {
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 7px;
}

.action-button {
  width: 29px;
  height: 29px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;
  border-radius: 5px;

  cursor: pointer;
}

.action-button .material-symbols-outlined {
  font-size: 15px;
}

.action-button.edit {
  background: #e0f5f7;
  color: #10a5b1;
}

.action-button.delete {
  background: #ffe8e8;
  color: #e26868;
}

/* =====================================================
   FOOTER TABLA
===================================================== */

.table-footer {
  min-height: 60px;

  padding: 12px 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-top: 1px solid #edf1f3;

  color: #8b96a0;
  font-size: 10px;
}

.records-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.records-per-page select {
  width: 55px;
  height: 30px;

  padding: 0 8px;

  border: 1px solid #dfe5e9;
  border-radius: 5px;

  outline: none;

  color: #66727d;
  background: white;

  font-size: 10px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination button {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: 1px solid #e0e5e9;
  border-radius: 5px;

  background: white;
  color: #7c8893;

  font-size: 10px;

  cursor: pointer;
}

.pagination .page-number.active {
  border-color: #0baebb;

  background: #0baebb;
  color: white;
}

.page-arrow .material-symbols-outlined {
  font-size: 17px;
}

/* =====================================================
   LOADING
===================================================== */

.loading-container {
  min-height: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 13px;

  color: #8d99a4;

  font-size: 12px;
}

.spinner {
  width: 35px;
  height: 35px;

  border: 3px solid #e3f3f5;
  border-top-color: #08aebb;
  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* =====================================================
   SIN RESULTADOS
===================================================== */

.no-results {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #98a4ae;
  text-align: center;
}

.no-results .material-symbols-outlined {
  margin-bottom: 10px;
  color: #0aaebb;
  font-size: 42px;
}

.no-results strong {
  color: #56636f;
  font-size: 13px;
}

.no-results p {
  margin: 5px 0 0;
  font-size: 11px;
}


.action-button:disabled,
.action-button.disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.delete-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(23, 39, 52, 0.42);
  backdrop-filter: blur(2px);
}

.delete-modal {
  position: relative;
  width: min(100%, 410px);
  padding: 30px 28px 26px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e8edf0;
  border-radius: 12px;
  box-shadow:
    0 22px 60px rgba(31, 49, 63, 0.18),
    0 4px 14px rgba(31, 49, 63, 0.08);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.delete-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #89959f;
  cursor: pointer;
}

.delete-close:hover {
  background: #f3f6f7;
}

.delete-close .material-symbols-outlined {
  font-size: 19px;
}

.delete-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff0f0;
  color: #df6666;
}

.delete-icon .material-symbols-outlined {
  font-size: 29px;
  font-variation-settings: 'FILL' 1;
}

.delete-modal h3 {
  margin: 0 0 9px;
  color: #34424e;
  font-size: 17px;
  font-weight: 700;
}

.delete-modal p {
  max-width: 320px;
  margin: 0 auto;
  color: #8a96a0;
  font-size: 11px;
  line-height: 1.6;
}

.delete-modal p strong {
  color: #56636e;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 23px;
}

.delete-cancel,
.delete-confirm {
  height: 39px;
  min-width: 112px;
  padding: 0 18px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.delete-cancel {
  border: 1px solid #dce4e8;
  background: #ffffff;
  color: #6c7984;
}

.delete-confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #e26a6a;
  background: #e26a6a;
  color: #ffffff;
}

.delete-confirm:hover {
  background: #d85d5d;
}

.delete-confirm .material-symbols-outlined {
  font-size: 16px;
}

.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.18s ease;
}

.confirm-enter-active .delete-modal,
.confirm-leave-active .delete-modal {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-from .delete-modal,
.confirm-leave-to .delete-modal {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

/* =====================================================
   TOASTS
===================================================== */

.toast-message {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;

  width: min(390px, calc(100vw - 32px));
  min-height: 72px;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px 14px 14px 16px;

  background: #ffffff;
  border: 1px solid #e7ecef;
  border-radius: 10px;

  box-shadow:
    0 18px 45px rgba(31, 49, 63, 0.15),
    0 3px 10px rgba(31, 49, 63, 0.06);

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.toast-message::before {
  content: "";
  position: absolute;
  top: 9px;
  bottom: 9px;
  left: 0;
  width: 4px;
  border-radius: 0 4px 4px 0;
}

.toast-success::before {
  background: #35a66f;
}

.toast-error::before {
  background: #e26868;
}

.toast-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
}

.toast-success .toast-icon {
  background: #e2f7eb;
  color: #399967;
}

.toast-error .toast-icon {
  background: #ffe8e8;
  color: #df6666;
}

.toast-icon .material-symbols-outlined {
  font-size: 22px;
  font-variation-settings: 'FILL' 1;
}

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.toast-content strong {
  color: #34424e;
  font-size: 12px;
  font-weight: 700;
}

.toast-content span {
  color: #7d8993;
  font-size: 11px;
  line-height: 1.45;
}

.toast-close {
  width: 30px;
  height: 30px;
  min-width: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border: 0;
  border-radius: 6px;

  background: transparent;
  color: #9aa5af;

  cursor: pointer;
}

.toast-close:hover {
  background: #f3f6f7;
  color: #66727d;
}

.toast-close .material-symbols-outlined {
  font-size: 18px;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(22px);
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {
  .filters-card {
    grid-template-columns: 1fr 1fr;
  }

  .search-box {
    grid-column: 1 / -1;
  }
}

@media (max-width: 750px) {
  .page-header {
    padding: 20px;
  }

  .admin-text {
    display: none;
  }

  .page-content {
    padding: 20px;
  }

  .filters-card {
    grid-template-columns: 1fr;
  }

  .search-box {
    grid-column: auto;
  }

  .table-footer {
    gap: 15px;
    align-items: flex-start;
    flex-direction: column;
  }

  .title-section p {
    display: none;
  }
}

@media (max-width: 520px) {
  .toast-message {
    top: 16px;
    right: 16px;
    left: 16px;
    width: auto;
  }

  .page-header {
    padding: 16px;
  }

  .title-section h1 {
    font-size: 21px;
  }

  .title-icon {
    width: 42px;
    height: 42px;
  }

  .header-actions {
    gap: 5px;
  }

  .page-content {
    padding: 14px;
  }

  .filters-card {
    padding: 15px;
  }

  .updated {
    display: none;
  }
}
</style>