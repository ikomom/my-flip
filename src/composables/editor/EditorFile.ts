class EditorFile {
  filename: string
  template: string
  script: string
  style: string

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
  ) {
    this.filename = filename
    this.template = template || ''
    this.script = script || ''
    this.style = style || ''
  }

  get code() {
    return `
      <script setup>
          ${this.script}
      </script>
      <template>
          ${this.template}
      </template>
    `
  }
}

export default EditorFile
