function requireBabel() {
  if (typeof Babel === 'undefined')
    throw new Error('React transform requires babel-standalone(https://unpkg.com/@babel/standalone/babel.min.js).')

  // eslint-disable-next-line no-undef
  return Babel
}

window['inline-module-loaders'] = window['inline-module-loaders'] || {}

window['inline-module-loaders'].react = {
  transform(code, options = {}) {
    const { availablePresets, transform } = requireBabel()
    const { filename } = options
    if (!/\.[tj]sx$/.test(filename))
      options.filename = `${filename}.jsx`
    // react loader转换
    const presets = [availablePresets.react]
    if (/\.tsx$/.test(filename))
      presets.push(availablePresets.typescript)
    console.log('transform', options)
    return transform(code, {
      presets: [availablePresets.react, availablePresets.typescript],
      ...options,
    })
  },
  imports: {
    'react': 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
    'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
    'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
  },
}
