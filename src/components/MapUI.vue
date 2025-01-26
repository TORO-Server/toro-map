<script lang="ts" setup>
import { MARKERURL, type Marker, type WORLD } from '@/constant'
import { useDataMapStore } from '@/stores/datamap'
import { Application, Container, Graphics, Point } from 'pixi.js'
import { onMounted, ref, watch } from 'vue'

const canvasContainer = ref<HTMLDivElement | null>(null)
const isAdded = ref(false)
const dataMapStore = useDataMapStore()

let _switchWorld: (world: (typeof WORLD)[keyof typeof WORLD]) => void

onMounted(async () => {
  if (!canvasContainer.value || isAdded.value) return
  isAdded.value = true

  let isDragging = false
  let startX = 0
  let startY = 0

  const app = new Application()
  await app.init({
    background: 0xdddddd,
    resizeTo: canvasContainer.value as HTMLElement,
    antialias: true,
    resolution: 2,
    autoDensity: true,
  })
  canvasContainer.value.appendChild(app.canvas)

  // グループ類
  const parent = app.stage.addChild(new Container())
  const areas = parent.addChild(new Container())
  const lines = parent.addChild(new Container())

  app.stage.hitArea = app.screen
  app.stage.interactive = true
  app.stage.onmousedown = (e) => {
    // ドラッグ開始・onmousemoveトリガー時のためにstartPos保存
    isDragging = true
    startX = e.clientX
    startY = e.clientY
  }
  app.stage.onmousemove = (e) => {
    // ドラッグしてなければパス
    if (!isDragging) return
    const rect = app.canvas.getBoundingClientRect()
    // 画面外に出たら終了
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      isDragging = false
      return
    }
    // ドラッグ
    parent.position.x += e.clientX - startX
    parent.position.y += e.clientY - startY
    // onmousemoveトリガー時のためにstartPos保存
    startX = e.clientX
    startY = e.clientY
  }
  app.stage.onmouseup = () => {
    // ドラッグ終了
    isDragging = false
  }
  app.stage.onwheel = (e) => {
    // ズーム前のマウス位置を取得
    const mouseX = e.clientX - app.canvas.offsetLeft
    const mouseY = e.clientY - app.canvas.offsetTop

    // グローバル座標をローカル座標に変換
    const localPos = parent.toLocal(new Point(mouseX, mouseY), app.stage)

    // ズームの増加量を設定
    const zoomFactor = e.deltaY * parent.scale.x * -0.001
    parent.scale.x += zoomFactor
    parent.scale.y += zoomFactor

    // ズーム後の新しい位置を計算
    const newLocalPos = parent.toGlobal(localPos)

    // mainの位置を調整
    parent.position.x += mouseX - newLocalPos.x
    parent.position.y += mouseY - newLocalPos.y
  }

  async function switchWorld(world: (typeof WORLD)[keyof typeof WORLD]) {
    dataMapStore.currentWorld = world
    const res = (await (await fetch(MARKERURL(world))).json()) as Marker
    dataMapStore.markers[world] = res
    areas.removeChildren()
    lines.removeChildren()
    for (const set of Object.values(res.sets)) {
      for (const area of Object.values(set.areas)) {
        const graphic = areas
          .addChild(new Graphics())
          .setStrokeStyle({
            color: area.color,
            width: area.weight * 5,
            alpha: area.opacity,
          })
          .setFillStyle({
            color: area.fillcolor,
            alpha: area.fillopacity,
          })
          .beginPath()
          .moveTo(area.x[0], area.z[0])

        for (let i = 1; i < area.x.length; i++) {
          graphic.lineTo(area.x[i], area.z[i])
        }

        graphic.lineTo(area.x[0], area.z[0]).fill().stroke()
      }
      for (const line of Object.values(set.lines)) {
        const graphic = lines
          .addChild(new Graphics())
          .setStrokeStyle({
            color: line.color,
            width: line.weight * 5,
            alpha: line.opacity,
          })
          .beginPath()
          .moveTo(line.x[0], line.z[0])

        for (let i = 1; i < line.x.length; i++) {
          graphic.lineTo(line.x[i], line.z[i])
        }

        graphic.stroke()
      }
    }
  }

  _switchWorld = switchWorld
  await switchWorld(dataMapStore.currentWorld)

  parent.position.set(-8 + app.renderer.width / 2, 2007 + app.renderer.height / 2)
})

watch(
  () => dataMapStore.currentWorld,
  () => {
    _switchWorld(dataMapStore.currentWorld)
  },
)
</script>

<template>
  <div id="pixicontainer" ref="canvasContainer"></div>
</template>

<style lang="css" scoped>
#pixicontainer {
  width: 100%;
  height: 100%;
}
</style>
