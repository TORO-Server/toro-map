<script setup lang="ts">
import { RouterView } from 'vue-router'
import MapUI from './components/MapUI.vue'
</script>

<template>
  <div class="flex">
    <aside>
      <RouterView />
    </aside>
    <main>
      <MapUI />
    </main>
  </div>
</template>

<style lang="css" scoped>
.flex {
  display: flex;
  overflow: hidden;
}

main {
  width: 75vw;
  height: 100vh;
}

aside {
  width: 25vw;
  height: 100vh;
  background-color: #222222;
  color: #dddddd;
}
</style>
