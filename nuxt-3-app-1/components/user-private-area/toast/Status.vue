<template>
  <div :class="['status-toast', `status-toast--${toastType}`]">
    <div :class="['status-toast__icon-wrapper', `status-toast__icon-wrapper--${icon.id}`]">
      <component
        :is="icon.component"
        :key="`status-toast-icon-${toastType}`"
        filled
        fill="currentColor"
        class="status-toast__icon"
      ></component>
    </div>
    <p class="status-toast__text">{{ data.text }}</p>
    <div class="close-button">
      <icons-close-cross fill="currentColor" class="close-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconsCheckMarkInCircle,
  IconsExclamationMarkInTriangle,
  IconsExclamationMarkInCircle
} from '#components'
import type { StatusToastDataType, StatusToastType } from '~/types/user-private-area/Toast'
import { type ToastOptions } from 'vue3-toastify'

type ToastType = Extract<ToastOptions['type'], StatusToastType>

const props = defineProps<{
  data: StatusToastDataType
  toastProps: ToastOptions
  closeToast: Function
}>()

const toastType = computed(() => props.toastProps.type as ToastType)

const icon = computed(() => {
  const getData = (id: ToastType, component: Component) => ({ id, component })
  const accordance: Record<ToastType, ReturnType<typeof getData>> = {
    success: getData('success', IconsCheckMarkInCircle),
    error: getData('error', IconsExclamationMarkInTriangle),
    warning: getData('warning', IconsExclamationMarkInCircle)
  }

  return accordance[toastType.value]
})
</script>

<style lang="scss" scoped>
.status-toast {
  display: flex;
  align-items: baseline;
  max-width: 552px;
  padding: 15px 16px 18px 16px;
  border-radius: 12px;
  background: $neutral-black-900;
  color: white;
}

.status-toast__icon-wrapper {
  position: relative;
  left: 1px;
  top: 3px;
  display: flex;

  &::before {
    content: '';
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
    height: 60%;
    z-index: 1;
  }

  $accordance: (
    'success': #{$success-green-500},
    'warning': #{$secondary-orange-300},
    'error': #{$error-red-500}
  );

  @each $colorType, $fillValue in $accordance {
    &--#{$colorType} {
      color: $fillValue;
    }
  }
}

.status-toast__icon {
  --size: 18px;

  position: relative;
  z-index: 2;
  min-width: var(--size);
  max-width: var(--size);
  min-height: var(--size);
  max-height: var(--size);
}

.status-toast__icon-wrapper--success::before,
.status-toast__icon-wrapper--error::before {
  background-color: white;
}

.status-toast__icon-wrapper--success::before {
  width: 60%;
}

.status-toast__icon-wrapper--warning::before,
.status-toast__icon-wrapper--error::before {
  width: 4px;
}

.status-toast__icon-wrapper--warning::before {
  background-color: #92651c;
}

.status-toast__text {
  margin: 0 8px 0 18px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: normal;
  font-family: 'Satoshi';
}

.close-button {
  position: relative;
  right: 1px;
  top: 2px;
  display: flex;
  padding: 5px;

  &:hover .close-icon {
    transform: rotate(90deg);
  }
}

.close-icon {
  --size: 16px;

  min-width: var(--size);
  max-width: var(--size);
  min-height: var(--size);
  max-height: var(--size);
  transition: all $animation-duration-1;
}
</style>
