<template>
  <el-radio-group>
    <el-radio
      v-for="(option, index) in props.options"
      :key="index"
      border
      :value="option.value"
    >
      <p class="custom-label">{{ option.label }}</p>

      <div class="thumbnail">
        <img :src="option.thumbnail" />
      </div>
    </el-radio>
  </el-radio-group>
</template>

<script lang="ts" setup>
import { RadioWithThumbnailOption } from '@/types'

const props = withDefaults(
  defineProps<{
    options: RadioWithThumbnailOption<string | number>[]
    size?: string
  }>(),
  {
    size: '10rem'
  }
)
</script>

<style scoped>
.el-radio-group {
  gap: 1rem;
}

.el-radio {
  --spacing: 1rem;

  height: auto;
  display: block;
  position: relative;
  padding: 0;
  margin-right: 3rem;
  border-width: 2px;
  border-radius: 1rem;
}

.el-radio > :deep(.el-radio__input) {
  position: absolute;
  bottom: var(--spacing);
  left: var(--spacing);
  z-index: 1;
}

.el-radio > :deep(.el-radio__label) {
  display: block;
  position: relative;
  padding: var(--spacing);
}

.el-radio > :deep(.el-radio__label::after) {
  content: '';
  display: block;
  background-color: var(--color-background-mute);
  width: calc(100% + 2 * var(--spacing));
  height: calc(1.4rem + 2 * var(--spacing));
  margin: calc(var(--spacing) * -1);
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
}

.custom-label {
  position: absolute;
  bottom: var(--spacing);
  left: calc(var(--spacing) + 1.4rem + 1rem);
  line-height: 1;
}

.thumbnail {
  height: calc(v-bind('props.size') + var(--spacing));
}

.thumbnail > img {
  width: 100%;
  height: v-bind('props.size');
}
</style>
