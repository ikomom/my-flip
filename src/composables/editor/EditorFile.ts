class EditorFile {
  filename: string
  template: string
  script: string
  style: string
  closeable: boolean

  compiled = {
    js: '',
    css: '',
    ssr: '',
  }

  constructor(
    filename: string,
    template?: string,
    script?: string,
    style?: string,
    closeable = true,
  ) {
    this.filename = filename
    this.template = template || ''
    this.script = script || ''
    this.style = style || ''
    this.closeable = !!closeable
  }

  get code() {
    return `
      <script setup >
          ${this.script}
      </script>
      <template>
          ${this.template}
      </template>
    `
  }
}

export default EditorFile
