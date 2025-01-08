<template>
  <transition-group v-if="group" :name="transitionNameComputed">
    <slot></slot>
  </transition-group>
  <transition v-else :name="transitionNameComputed" mode="out-in">
    <slot></slot>
  </transition>
</template>

<script lang="ts">
export default { inheritAttrs: true }
</script>

<script setup lang="ts">
export type DurationType = '1' | '2' | null

const props = withDefaults(
  defineProps<{
    // Corresponds to a set of available transition types in the scss/global/animations.scss file
    transitionName?: 'regular-fade-transition' | 'regular-semi-fade-transition'
    group?: boolean
    // Corresponds to a set of available variables in the scss/variables/_animations.scss file
    duration?: DurationType
  }>(),
  {
    transitionName: 'regular-fade-transition',
    group: false,
    duration: '1'
  }
)

// Transition names correspond to the ones defined in scss/global/animations.scss file
const transitionNameComputed = computed(() =>
  props.duration ? `${props.transitionName}--duration-${props.duration}` : 'regular-fade-transition'
)
</script>
