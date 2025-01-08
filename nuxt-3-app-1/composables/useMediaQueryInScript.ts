import responsivenessVariables from '@/assets/scss/variables/_responsiveness.module.scss'

// Allows to compute the media queries results in a script (similarly to the ones defined in the "~/assets/scss/mixins/_media-query.scss")
export const useMediaQueryInScript = <CustomRulesToComputeType>(
  customRulesToCompute?: CustomRulesToComputeType
) => {
  const { $addGlobalEventListener, $removeGlobalEventListener } = useNuxtApp()

  // The default set of media queries. The custom ones could be provided via customRulesToCompute-prop with the very same schema, as the default ones
  const defaultRules = {
    isMobile: `(width <= $tablet)`,
    isTablet: `($tablet <= width < $laptop)`,
    isLaptop: `($laptop <= width)`,
    isLayoutSidebarCollapsible: `(width <= $layout-sidebar-collapse-max-width)`,
    isTabletAndHigher: `(width > $mobile)`,
    isMobileAndTablet: `(width < $laptop)`
  }
  type ResultType = { [key in keyof typeof defaultRules | keyof CustomRulesToComputeType]: boolean }
  const result = ref(
    Object.keys({
      ...defaultRules,
      ...(customRulesToCompute || {})
    }).reduce((acc, key) => {
      Object.defineProperty(acc, key, { value: false, enumerable: true, writable: true })

      return acc
    }, {})
  ) as Ref<ResultType>

  const onWindowResize = () => {
    const computeRules = (rules: Object) =>
      Object.entries(rules).reduce((acc, [key, media]) => {
        const breakpoints = Object.keys(responsivenessVariables)
        const formattedMedia = media
          .replace(
            new RegExp(`${breakpoints.join('|')}`, 'gi'),
            (matched: keyof typeof responsivenessVariables) => responsivenessVariables?.[matched]
          )
          // Yes, I didn't manage to make the RegExp grab the entire thing like $mobile, so the $-characters have to be manually removed. I HATE THE REGULAR EXPRESSIONS SYNTAX!!!
          .replaceAll('$', '')

        Object.defineProperty(acc, key, {
          value: window.matchMedia(formattedMedia).matches,
          enumerable: true,
          writable: true
        })

        return acc
      }, {}) as ResultType

    result.value = {
      ...computeRules(defaultRules),
      ...computeRules(customRulesToCompute || {})
    }
  }

  onMounted(() => {
    $addGlobalEventListener('window:resize', onWindowResize)
    onWindowResize()
  })

  onBeforeUnmount(() => {
    $removeGlobalEventListener('window:resize', onWindowResize)
  })

  return result
}
