import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none'],
    ['icon', 'relative w-2 h-2 top-1 inline-block !outline-none'],
    ['s-link', 'group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-teal-600 hover:text-white'],
    ['s-link-active', 'group flex w-full items-center rounded-md px-2 py-2 text-sm bg-teal-600 text-white'],
    ['s-tag', 'mx-2 text-white px-2 py-1 inline-block bg-yellow'],
    ['s-layout-between', 'flex items-center justify-between'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  //   transformerVariantGroup(),
  ],
})
