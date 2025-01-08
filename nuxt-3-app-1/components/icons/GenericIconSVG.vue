<template>
  <regular-fade-transition
    v-if="regularTransitionBetweenStateDuration"
    :duration="regularTransitionBetweenStateDuration"
    transition-name="regular-semi-fade-transition"
  >
    <render v-bind="$attrs" />
  </regular-fade-transition>
  <render v-else />
</template>

<script setup lang="tsx">
import { IconsVerticalBlackLinearGradientSVG } from '#components'
import type { DurationType } from '~/components/RegularFadeTransition.vue'

type PropsType = {
  colorPreset?:
    | 'primary-blue'
    | 'neutral-black-900'
    | 'neutral-black-300'
    | 'black-gradient'
    | 'default'
  filled?: boolean
  fill?: string | false
  fillTransitionDuration?: string
  regularTransitionBetweenStateDuration?: DurationType
}

const props = withDefaults(defineProps<PropsType>(), {
  colorPreset: 'default',
  filled: false,
  fill: false,
  fillTransitionDuration: '0.3s',
  regularTransitionBetweenStateDuration: '1'
})

const slots = defineSlots<{
  default(props: PropsType): any
  filled(props: PropsType): any
  outlined(props: PropsType): any
}>()

const manuallyFillColor = computed(() => props.fill)
const fillTransitionDuration = computed(() => props.fillTransitionDuration)

const render = () => {
  const activeSlot = props.filled ? slots.filled : slots.outlined || slots.default
  const defaultSlotSvgContent = (activeSlot as Function)({ colorPreset: props.colorPreset })
  const { type, props: svgProps, children: svgChildren } = defaultSlotSvgContent[0]

  return h(
    type,
    {
      ...svgProps,
      class: [
        ...[manuallyFillColor.value && 'manually-filled', fillTransitionDuration.value && 'fill-animated'].filter(Boolean),
        `color__${props.colorPreset || 'default'}`,
        svgProps.class
      ].join(' '),
      key: props.filled ? 'filled' : 'not-filled'
    },
    [h(IconsVerticalBlackLinearGradientSVG, { id: 'black-gradient' }), ...svgChildren]
  )
}
</script>

<style lang="scss" scoped>
$accordance: (
  'primary-blue': #{$primary-blue},
  'neutral-black-900': #{$neutral-black-900},
  'neutral-black-300': #{$neutral-black-300},
  'default': #{$neutral-black-900},
  'black-gradient': url(#black-gradient)
);

@each $colorPreset, $fillValue in $accordance {
  .color__#{$colorPreset} {
    &,
    path {
      fill: $fillValue;
    }
  }
}

.fill-animated {
  transition-property: fill;
  transition-duration: v-bind(fillTransitionDuration);
}

.manually-filled {
  &,
  path {
    fill: v-bind(manuallyFillColor);
  }
}
</style>
