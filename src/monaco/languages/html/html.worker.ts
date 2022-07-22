// @ts-expect-error
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'

self.onmessage = (e) => {
  console.log('html worker onMessage', e, worker)
}
