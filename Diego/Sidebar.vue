<template>
  <aside class="sidebar">
    <!-- LOGO -->
    <div class="logo-container">
      <div class="logo-circle">
        <span class="logo-text">JR</span>
      </div>
    </div>

    <!-- MENÚ PRINCIPAL -->
    <nav class="menu">
      <RouterLink to="/" class="menu-item">
        <span class="material-symbols-outlined">home</span>
        <span>Inicio</span>
      </RouterLink>

      <RouterLink to="/clientes" class="menu-item">
        <span class="material-symbols-outlined">person</span>
        <span>Clientes</span>
      </RouterLink>

      <RouterLink to="/vehiculos" class="menu-item">
        <span class="material-symbols-outlined">directions_car</span>
        <span>Vehículos</span>
      </RouterLink>

      <RouterLink to="/ordenes" class="menu-item">
        <span class="material-symbols-outlined">description</span>
        <span>Órdenes de trabajo</span>
      </RouterLink>

      <RouterLink to="/servicios" class="menu-item">
        <span class="material-symbols-outlined">build</span>
        <span>Servicios</span>
      </RouterLink>

      <RouterLink to="/repuestos" class="menu-item">
        <span class="material-symbols-outlined">inventory_2</span>
        <span>Repuestos</span>
      </RouterLink>

      <RouterLink to="/pagos" class="menu-item">
        <span class="material-symbols-outlined">credit_card</span>
        <span>Pagos</span>
      </RouterLink>

      <RouterLink to="/reportes" class="menu-item">
        <span class="material-symbols-outlined">bar_chart</span>
        <span>Reportes</span>
      </RouterLink>
    </nav>

    <!-- MENÚ INFERIOR -->
    <div class="bottom-menu">
      <button class="bottom-button">
        <span class="material-symbols-outlined">badge</span>
      </button>

      <button class="bottom-button">
        <span class="material-symbols-outlined">layers</span>
      </button>

      <button class="bottom-button">
        <span class="material-symbols-outlined">settings</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.sidebar {
  width: 208px;
  min-width: 208px;
  height: 100vh;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;

  background: linear-gradient(
    180deg,
    #0bb7c5 0%,
    #05aab8 50%,
    #09b4bf 100%
  );

  color: white;
  z-index: 100;
}

/* =========================
   LOGO
========================= */

.logo-container {
  height: 125px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-circle {
  width: 96px;
  height: 96px;

  border: 2px solid white;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: white;
  font-family: Arial, sans-serif;
  font-size: 42px;
  font-weight: 300;
  letter-spacing: -5px;
}

/* =========================
   MENÚ
========================= */

.menu {
  display: flex;
  flex-direction: column;
  gap: 3px;

  padding: 0 10px;
}

.menu-item {
  width: 100%;
  height: 49px;

  display: flex;
  align-items: center;
  gap: 17px;

  padding: 0 17px;

  color: white;
  text-decoration: none;

  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;

  border-radius: 7px;

  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.menu-item .material-symbols-outlined {
  width: 23px;

  font-size: 23px;
  font-variation-settings:
    'FILL' 1,
    'wght' 600,
    'GRAD' 0,
    'opsz' 24;
}

.menu-item:hover {
  background: rgba(0, 112, 130, 0.28);
}

.menu-item.router-link-exact-active {
  background: rgba(0, 112, 130, 0.48);
}

/* =========================
   BOTONES INFERIORES
========================= */

.bottom-menu {
  margin-top: auto;

  padding: 0 0 21px 24px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 14px;
}

.bottom-button {
  width: 30px;
  height: 30px;

  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background: transparent;
  border: none;

  cursor: pointer;
}

.bottom-button .material-symbols-outlined {
  font-size: 22px;

  font-variation-settings:
    'FILL' 1,
    'wght' 600,
    'GRAD' 0,
    'opsz' 24;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {
  .sidebar {
    width: 76px;
    min-width: 76px;
  }

  .logo-container {
    height: 100px;
  }

  .logo-circle {
    width: 58px;
    height: 58px;
  }

  .logo-text {
    font-size: 26px;
    letter-spacing: -3px;
  }

  .menu {
    padding: 0 8px;
  }

  .menu-item {
    justify-content: center;

    height: 48px;

    padding: 0;
  }

  .menu-item > span:last-child {
    display: none;
  }

  .bottom-menu {
    align-items: center;

    padding-left: 0;
  }
}
</style>