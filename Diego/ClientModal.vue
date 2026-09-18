<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @mousedown.self="closeModal">
        <div
          class="modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="client-modal-title"
        >
          <!-- HEADER -->
          <div class="modal-header">
            <div class="modal-title">
              <div class="title-icon">
                <span class="material-symbols-outlined">{{ mode === 'edit' ? 'edit' : 'person_add' }}</span>
              </div>

              <div>
                <h2 id="client-modal-title">
                  {{ mode === 'edit' ? 'Editar cliente' : 'Nuevo cliente' }}
                </h2>
                <p>
                  {{
                    mode === 'edit'
                      ? 'Modifica la información del cliente o tallerista.'
                      : 'Registra la información del cliente o tallerista.'
                  }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="close-button"
              aria-label="Cerrar"
              @click="closeModal"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- FORMULARIO -->
          <form class="client-form" @submit.prevent="submitForm">
            <div class="form-section">
              <div class="section-title">
                <span class="material-symbols-outlined">badge</span>
                <span>Información personal</span>
              </div>

              <div class="form-grid">
                <!-- NOMBRE -->
                <div class="form-group full-width">
                  <label for="client-name">
                    Nombre completo
                    <span class="required">*</span>
                  </label>

                  <div
                    class="input-wrapper"
                    :class="{ invalid: errors.nombre }"
                  >
                    <span class="material-symbols-outlined field-icon">
                      person
                    </span>

                    <input
                      id="client-name"
                      v-model="form.nombre"
                      type="text"
                      maxlength="100"
                      placeholder="Ej. Juan Pérez"
                      autocomplete="name"
                      @input="clearError('nombre')"
                    />
                  </div>

                  <span v-if="errors.nombre" class="error-message">
                    {{ errors.nombre }}
                  </span>
                </div>

                <!-- CÉDULA / DUI -->
                <div class="form-group">
                  <label for="client-document">
                    Cédula / DUI
                    <span class="required">*</span>
                  </label>

                  <div
                    class="input-wrapper"
                    :class="{ invalid: errors.cedula }"
                  >
                    <span class="material-symbols-outlined field-icon">
                      id_card
                    </span>

                    <input
                      id="client-document"
                      v-model="form.cedula"
                      type="text"
                      maxlength="10"
                      placeholder="00000000-0"
                      inputmode="numeric"
                      @input="handleDuiInput"
                    />
                  </div>

                  <span v-if="errors.cedula" class="error-message">
                    {{ errors.cedula }}
                  </span>
                </div>

                <!-- TELÉFONO -->
                <div class="form-group">
                  <label for="client-phone">
                    Teléfono
                    <span class="required">*</span>
                  </label>

                  <div
                    class="input-wrapper"
                    :class="{ invalid: errors.telefono }"
                  >
                    <span class="material-symbols-outlined field-icon">
                      call
                    </span>

                    <input
                      id="client-phone"
                      v-model="form.telefono"
                      type="text"
                      maxlength="9"
                      placeholder="7000-0000"
                      inputmode="tel"
                      autocomplete="tel"
                      @input="handlePhoneInput"
                    />
                  </div>

                  <span v-if="errors.telefono" class="error-message">
                    {{ errors.telefono }}
                  </span>
                </div>

                <!-- TIPO -->
                <div class="form-group full-width">
                  <label for="client-type">
                    Tipo de cliente
                    <span class="required">*</span>
                  </label>

                  <div
                    class="select-field"
                    :class="{ invalid: errors.tipo }"
                  >
                    <span class="material-symbols-outlined field-icon">
                      groups
                    </span>

                    <select
                      id="client-type"
                      v-model="form.tipo"
                      @change="clearError('tipo')"
                    >
                      <option value="" disabled>
                        Selecciona un tipo
                      </option>
                      <option value="Cliente">Cliente</option>
                      <option value="Tallerista">Tallerista</option>
                    </select>

                    <span class="material-symbols-outlined select-arrow">
                      keyboard_arrow_down
                    </span>
                  </div>

                  <span v-if="errors.tipo" class="error-message">
                    {{ errors.tipo }}
                  </span>
                </div>

                <!-- DIRECCIÓN -->
                <div class="form-group full-width">
                  <label for="client-address">
                    Dirección
                    <span class="required">*</span>
                  </label>

                  <div
                    class="textarea-wrapper"
                    :class="{ invalid: errors.direccion }"
                  >
                    <span class="material-symbols-outlined field-icon textarea-icon">
                      location_on
                    </span>

                    <textarea
                      id="client-address"
                      v-model="form.direccion"
                      maxlength="180"
                      rows="3"
                      placeholder="Ej. San Miguel, San Miguel"
                      @input="clearError('direccion')"
                    ></textarea>
                  </div>

                  <div class="field-bottom">
                    <span v-if="errors.direccion" class="error-message">
                      {{ errors.direccion }}
                    </span>

                    <span v-else></span>

                    <span class="character-counter">
                      {{ form.direccion.length }}/180
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="modal-footer">
              <button
                type="button"
                class="cancel-button"
                @click="closeModal"
              >
                Cancelar
              </button>

              <button type="submit" class="save-button">
                <span class="material-symbols-outlined">
                  {{ mode === 'edit' ? 'edit' : 'save' }}
                </span>
                {{ mode === 'edit' ? 'Guardar cambios' : 'Guardar cliente' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

type ClientType = 'Cliente' | 'Tallerista'

export interface NewClient {
  nombre: string
  cedula: string
  telefono: string
  tipo: ClientType
  direccion: string
}

const props = withDefaults(
  defineProps<{
    open: boolean
    client?: NewClient | null
    mode?: 'create' | 'edit'
  }>(),
  {
    client: null,
    mode: 'create'
  }
)

const mode = computed(() => props.mode)

const emit = defineEmits<{
  close: []
  save: [client: NewClient]
}>()

const form = reactive({
  nombre: '',
  cedula: '',
  telefono: '',
  tipo: '' as ClientType | '',
  direccion: ''
})

const errors = reactive({
  nombre: '',
  cedula: '',
  telefono: '',
  tipo: '',
  direccion: ''
})

function clearError(field: keyof typeof errors) {
  errors[field] = ''
}

function resetForm() {
  form.nombre = ''
  form.cedula = ''
  form.telefono = ''
  form.tipo = ''
  form.direccion = ''

  errors.nombre = ''
  errors.cedula = ''
  errors.telefono = ''
  errors.tipo = ''
  errors.direccion = ''
}

/* Formato DUI: 00000000-0 */
function handleDuiInput(event: Event) {
  const input = event.target as HTMLInputElement
  let numbers = input.value.replace(/\D/g, '').slice(0, 9)

  if (numbers.length > 8) {
    numbers = `${numbers.slice(0, 8)}-${numbers.slice(8)}`
  }

  form.cedula = numbers
  clearError('cedula')
}

/* Formato teléfono: 7000-0000 */
function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  let numbers = input.value.replace(/\D/g, '').slice(0, 8)

  if (numbers.length > 4) {
    numbers = `${numbers.slice(0, 4)}-${numbers.slice(4)}`
  }

  form.telefono = numbers
  clearError('telefono')
}

function validateForm() {
  let valid = true

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre completo es obligatorio.'
    valid = false
  } else if (form.nombre.trim().length < 3) {
    errors.nombre = 'Ingresa un nombre válido.'
    valid = false
  }

  if (!form.cedula.trim()) {
    errors.cedula = 'La cédula o DUI es obligatoria.'
    valid = false
  } else if (!/^\d{8}-\d$/.test(form.cedula)) {
    errors.cedula = 'Usa el formato 00000000-0.'
    valid = false
  }

  if (!form.telefono.trim()) {
    errors.telefono = 'El teléfono es obligatorio.'
    valid = false
  } else if (!/^\d{4}-\d{4}$/.test(form.telefono)) {
    errors.telefono = 'Usa el formato 7000-0000.'
    valid = false
  }

  if (!form.tipo) {
    errors.tipo = 'Selecciona el tipo de cliente.'
    valid = false
  }

  if (!form.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria.'
    valid = false
  } else if (form.direccion.trim().length < 5) {
    errors.direccion = 'Ingresa una dirección válida.'
    valid = false
  }

  return valid
}

function submitForm() {
  if (!validateForm()) return

  const client: NewClient = {
    nombre: form.nombre.trim(),
    cedula: form.cedula,
    telefono: form.telefono,
    tipo: form.tipo as ClientType,
    direccion: form.direccion.trim()
  }

  emit('save', client)
  resetForm()
}

function closeModal() {
  resetForm()
  emit('close')
}

function loadClient() {
  if (props.mode === 'edit' && props.client) {
    form.nombre = props.client.nombre
    form.cedula = props.client.cedula
    form.telefono = props.client.telefono
    form.tipo = props.client.tipo
    form.direccion = props.client.direccion
    return
  }

  resetForm()
}

watch(
  () => [props.open, props.client, props.mode] as const,
  ([isOpen]) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    if (isOpen) {
      loadClient()
    } else {
      resetForm()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: rgba(23, 39, 52, 0.42);
  backdrop-filter: blur(2px);
}

.modal-container {
  width: min(100%, 620px);
  max-height: calc(100vh - 48px);

  overflow-y: auto;

  background: #ffffff;
  border: 1px solid #e6edf1;
  border-radius: 10px;

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

/* HEADER */

.modal-header {
  min-height: 86px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 18px 22px;

  border-bottom: 1px solid #edf1f3;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 13px;
}

.title-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;

  background: #e1f7f9;
  color: #09aebb;
}

.title-icon .material-symbols-outlined {
  font-size: 23px;
  font-variation-settings: 'FILL' 1;
}

.modal-title h2 {
  margin: 0 0 4px;

  color: #2f3e4b;

  font-size: 17px;
  font-weight: 700;
}

.modal-title p {
  margin: 0;

  color: #96a1ab;

  font-size: 11px;
}

.close-button {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 6px;

  background: transparent;
  color: #89959f;

  cursor: pointer;
}

.close-button:hover {
  background: #f3f6f7;
}

.close-button .material-symbols-outlined {
  font-size: 20px;
}

/* FORMULARIO */

.client-form {
  margin: 0;
}

.form-section {
  padding: 22px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 7px;

  margin-bottom: 18px;

  color: #52616e;

  font-size: 12px;
  font-weight: 700;
}

.section-title .material-symbols-outlined {
  color: #0aaebb;
  font-size: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;

  column-gap: 18px;
  row-gap: 17px;
}

.form-group {
  min-width: 0;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: #5d6a75;

  font-size: 11px;
  font-weight: 600;
}

.required {
  color: #eb6a6a;
}

/* INPUT */

.input-wrapper,
.select-field,
.textarea-wrapper {
  position: relative;

  border: 1px solid #dfe6eb;
  border-radius: 6px;

  background: #ffffff;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.input-wrapper {
  height: 42px;
}

.input-wrapper:focus-within,
.select-field:focus-within,
.textarea-wrapper:focus-within {
  border-color: #0aaebb;
  box-shadow: 0 0 0 3px rgba(10, 174, 187, 0.08);
}

.input-wrapper.invalid,
.select-field.invalid,
.textarea-wrapper.invalid {
  border-color: #e77676;
}

.field-icon {
  position: absolute;

  left: 12px;
  top: 50%;

  transform: translateY(-50%);

  color: #9aa6af;
  font-size: 18px;

  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  height: 100%;

  padding: 0 12px 0 40px;

  border: none;
  outline: none;

  background: transparent;

  color: #45535f;

  font-family: inherit;
  font-size: 11px;
}

input::placeholder,
textarea::placeholder {
  color: #a8b1b9;
}

/* SELECT */

.select-field {
  height: 42px;
}

.select-field select {
  appearance: none;

  width: 100%;
  height: 100%;

  padding: 0 40px;

  border: none;
  outline: none;

  background: transparent;

  color: #56636e;

  font-family: inherit;
  font-size: 11px;

  cursor: pointer;
}

.select-arrow {
  position: absolute;

  top: 50%;
  right: 11px;

  transform: translateY(-50%);

  color: #8f9ba5;
  font-size: 19px;

  pointer-events: none;
}

/* TEXTAREA */

.textarea-wrapper {
  min-height: 88px;
}

.textarea-wrapper textarea {
  width: 100%;
  min-height: 86px;

  display: block;

  padding: 12px 12px 12px 40px;

  resize: vertical;

  border: none;
  outline: none;

  background: transparent;

  color: #45535f;

  font-family: inherit;
  font-size: 11px;
  line-height: 1.5;
}

.textarea-icon {
  top: 13px;

  transform: none;
}

/* ERRORES */

.error-message {
  display: block;

  margin-top: 5px;

  color: #db6262;

  font-size: 9px;
}

.field-bottom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.character-counter {
  margin-top: 5px;

  color: #a4aeb7;

  font-size: 9px;
}

/* FOOTER */

.modal-footer {
  min-height: 72px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  gap: 10px;

  padding: 14px 22px;

  border-top: 1px solid #edf1f3;

  background: #fbfcfd;
}

.cancel-button,
.save-button {
  height: 39px;

  padding: 0 19px;

  border-radius: 6px;

  font-family: inherit;
  font-size: 11px;
  font-weight: 600;

  cursor: pointer;
}

.cancel-button {
  border: 1px solid #dce4e8;

  background: #ffffff;
  color: #6c7984;
}

.cancel-button:hover {
  background: #f7f9fa;
}

.save-button {
  min-width: 137px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  border: 1px solid #08aebb;

  background: #08aebb;
  color: #ffffff;

  box-shadow: 0 3px 8px rgba(8, 174, 187, 0.15);
}

.save-button:hover {
  background: #079faa;
}

.save-button .material-symbols-outlined {
  font-size: 16px;
}

/* ANIMACIÓN */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: translateY(8px) scale(0.985);
}

/* RESPONSIVE */

@media (max-width: 650px) {
  .modal-overlay {
    align-items: flex-end;

    padding: 0;
  }

  .modal-container {
    width: 100%;
    max-height: 94vh;

    border-radius: 12px 12px 0 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .modal-header,
  .form-section {
    padding-left: 18px;
    padding-right: 18px;
  }

  .modal-footer {
    padding: 14px 18px;
  }

  .cancel-button,
  .save-button {
    flex: 1;
  }
}
</style>