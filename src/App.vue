<script setup lang="ts">
import { RouterView } from 'vue-router'

import MapUI from './components/MapUI.vue'

import { WORLD } from './constant'
import { useDataMapStore } from './stores/datamap'

const datamapStore = useDataMapStore()

function worldchange(worldchange2: (typeof WORLD)[keyof typeof WORLD]) {
  datamapStore.currentWorld = worldchange2
}
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

  <div class="layerselect">
    <ul>
      <li v-for="(item, index) in WORLD" :key="index">
        <span @click="worldchange(item)" :class="{ current: item === datamapStore.currentWorld }">{{
          item
        }}</span>
      </li>
    </ul>
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
  overflow-y: auto;
}

.layerselect {
  background-color: #22222299;
  backdrop-filter: blur(5px);
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  color: #dddddd;
  border-radius: 15px;
  padding: 15px;
  font-size: 1.2rem;
  width: 5rem;
}

.layerselect ul li span {
  cursor: pointer;
  border-left: solid transparent 0.5rem;
  padding-left: 0.5rem;
  transition: 0.2s;
}

.layerselect ul li span.current {
  border-left: solid #dd28a7 1rem;
  color: #999999;
}

@media (max-width: 900px) {
  .flex {
    flex-direction: column-reverse;
  }

  main {
    width: 100vw;
    height: 65vh;
  }

  aside {
    width: 100vw;
    height: 35vh;
    background-color: #222222;
    color: #dddddd;
  }

  .layerselect {
    bottom: auto;
    top: 3rem;
  }
}
</style>
