<script setup lang="ts">
import { hexToHsl, hslToHex, isValidHex, normalizeHex } from '@/utils/colors'

interface ColorPickerProps {
  modelValue?: string
  showPreview?: boolean
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '#667eea',
  showPreview: true
})

const emit = defineEmits<{
  'update:modelValue': [color: string]
  confirm: [color: string]
  cancel: []
}>()

// 内部颜色状态
const internalColor = ref(props.modelValue)

// 同步外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== internalColor.value) {
      internalColor.value = newVal
    }
  }
)

// 解析 HSL 值
const hsl = computed(() => hexToHsl(internalColor.value))

// 更新颜色
const updateColor = (newHsl: { h?: number; s?: number; l?: number }) => {
  const currentHsl = hexToHsl(internalColor.value)
  const updatedHsl = {
    h: newHsl.h !== undefined ? newHsl.h : currentHsl.h,
    s: newHsl.s !== undefined ? newHsl.s : currentHsl.s,
    l: newHsl.l !== undefined ? newHsl.l : currentHsl.l
  }
  internalColor.value = hslToHex(updatedHsl.h, updatedHsl.s, updatedHsl.l)
  emit('update:modelValue', internalColor.value)
}

// HEX 输入处理
const hexInput = ref(props.modelValue)
const hexInputError = ref(false)

watch(internalColor, (newColor) => {
  hexInput.value = newColor
  hexInputError.value = false
})

const handleHexInput = (value: string) => {
  hexInput.value = value
  if (isValidHex(value)) {
    const normalized = normalizeHex(value)
    internalColor.value = normalized
    emit('update:modelValue', normalized)
    hexInputError.value = false
  } else {
    hexInputError.value = true
  }
}

// 确认和取消
const handleConfirm = () => {
  emit('confirm', internalColor.value)
}

const handleCancel = () => {
  emit('cancel')
}

// 滑块组件引用
const hueSliderRef = ref<HTMLElement>()
const saturationPanelRef = ref<HTMLElement>()

// 处理色相滑块点击
const handleHueClick = (event: MouseEvent) => {
  if (!hueSliderRef.value) return
  const rect = hueSliderRef.value.getBoundingClientRect()
  const x = event.offsetX
  const newHue = Math.round((x / rect.width) * 360)
  updateColor({ h: newHue })
}

// 处理饱和度/亮度面板点击
const handleSaturationClick = (event: MouseEvent) => {
  if (!saturationPanelRef.value) return
  const rect = saturationPanelRef.value.getBoundingClientRect()
  const x = event.offsetX
  const y = event.offsetY
  const newSaturation = Math.round((x / rect.width) * 100)
  const newLightness = Math.round(50 - (y / rect.height) * 50)
  updateColor({ s: newSaturation, l: Math.max(0, Math.min(100, newLightness)) })
}

// 拖动状态
const isDragging = ref(false)
const dragTarget = ref<'hue' | 'saturation' | null>(null)

const handleMouseDown = (target: 'hue' | 'saturation', event: MouseEvent) => {
  isDragging.value = true
  dragTarget.value = target
  handleDrag(event)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  handleDrag(event)
}

const handleMouseUp = () => {
  isDragging.value = false
  dragTarget.value = null
}

const handleDrag = (event: MouseEvent) => {
  if (dragTarget.value === 'hue' && hueSliderRef.value) {
    const rect = hueSliderRef.value.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
    const newHue = Math.round((x / rect.width) * 360)
    updateColor({ h: newHue })
  } else if (dragTarget.value === 'saturation' && saturationPanelRef.value) {
    const rect = saturationPanelRef.value.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top))
    const newSaturation = Math.round((x / rect.width) * 100)
    const newLightness = Math.round(50 - (y / rect.height) * 50)
    updateColor({ s: newSaturation, l: Math.max(0, Math.min(100, newLightness)) })
  }
}

// 添加全局事件监听
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="color-picker">
    <!-- 饱和度/亮度面板 -->
    <div
      class="saturation-panel"
      ref="saturationPanelRef"
      :style="{ background: `hsl(${hsl.h}, 100%, 50%)` }"
      @click="handleSaturationClick"
      @mousedown="handleMouseDown('saturation', $event)"
    >
      <div class="saturation-white"></div>
      <div class="saturation-black"></div>
      <div
        class="saturation-handle"
        :style="{
          left: `${hsl.s}%`,
          bottom: `${hsl.l * 2}%`
        }"
      ></div>
    </div>

    <!-- 色相滑块 -->
    <div class="hue-slider-wrapper">
      <div
        class="hue-slider"
        ref="hueSliderRef"
        @click="handleHueClick"
        @mousedown="handleMouseDown('hue', $event)"
      >
        <div class="hue-handle" :style="{ left: `${(hsl.h / 360) * 100}%` }"></div>
      </div>
    </div>

    <!-- HEX 输入框 -->
    <div class="hex-input-wrapper">
      <label>HEX 颜色</label>
      <el-input
        v-model="hexInput"
        :class="{ error: hexInputError }"
        placeholder="#000000"
        @input="handleHexInput"
      />
      <span class="error-text" v-if="hexInputError">无效的颜色值</span>
    </div>

    <!-- 颜色预览 -->
    <div class="preview-wrapper" v-if="showPreview">
      <label>预览</label>
      <div class="preview-color" :style="{ background: internalColor }"></div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.saturation-panel {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  cursor: crosshair;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .saturation-white {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }

  .saturation-black {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%);
    pointer-events: none;
  }

  .saturation-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 3px solid rgba(0, 0, 0, 0.3);
    transform: translate(-50%, 50%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }
}

.hue-slider-wrapper {
  padding: 0 4px;
}

.hue-slider {
  position: relative;
  width: 100%;
  height: 24px;
  border-radius: 12px;
  background: linear-gradient(
    to right,
    #ff0000 0%,
    #ffff00 17%,
    #00ff00 33%,
    #00ffff 50%,
    #0000ff 67%,
    #ff00ff 83%,
    #ff0000 100%
  );
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .hue-handle {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 32px;
    background: white;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }
}

.hex-input-wrapper,
.preview-wrapper {
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #495057;
    margin-bottom: 6px;
  }

  .el-input {
    width: 100%;

    &.error {
      :deep(.el-input__wrapper) {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
      }
    }
  }

  .error-text {
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
  }
}

.preview-color {
  width: 100%;
  height: 60px;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  .el-button {
    min-width: 80px;
  }
}
</style>
