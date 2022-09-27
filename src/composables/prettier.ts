import prettier from 'prettier'
// @ts-expect-error
import parserJson from 'prettier/esm/parser-babel.mjs'
// @ts-expect-error
import parserHtml from 'prettier/esm/parser-html.mjs'
// @ts-expect-error
import parserTs from 'prettier/esm/parser-typescript.mjs'

export const formatVue = (source: string) => {
  const p = prettier.format(source, {
    parser: 'vue',
    plugins: [parserJson, parserHtml, parserTs],
  })
  console.log('prettier'
    , prettier, p)
  return p
}

