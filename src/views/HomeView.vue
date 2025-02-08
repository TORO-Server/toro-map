<script setup lang="ts">
import { useDataMapStore } from '@/stores/datamap'

const datamapStore = useDataMapStore()
</script>

<template>
  <div class="home">
    <h2>操作方法</h2>
    <ul>
      <li>ホイールを回すとズームができます。</li>
      <li>ドラッグで移動ができます。</li>
    </ul>

    <h2>ステータス</h2>
    <div class="ibox" :class="[datamapStore.connections.dynmap ? 'succ' : 'warn']">
      <span>{{
        datamapStore.connections.dynmap
          ? 'TOROServer Dynmap 接続済み'
          : 'TOROServer Dynmap との接続を試みています...'
      }}</span>
      <p>TORO ServerのDynmapからマーカーのデータ等を取得します。</p>
    </div>
    <div class="ibox" :class="[datamapStore.connections.tord ? 'succ' : 'warn']">
      <span>{{
        datamapStore.connections.tord ? 'TORD 接続済み' : 'TORD との接続を試みています...'
      }}</span>
      <p>
        Googleスプレッドシート上のデータから取得します。TORDはデータ量が多いので、数十秒かかることがあります。
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.home {
  padding: 15px;
}
</style>
