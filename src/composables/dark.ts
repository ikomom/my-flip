export const isDark = computed(() => mode.value.includes('dark'))

export const mode = useColorMode({
  modes: {
    contrast: 'dark contrast',
    cafe: 'cafe',
  },
})
