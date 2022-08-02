import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker'
import { HTMLWorker } from './HtmlWorker'
// @ts-expect-error

self.onmessage = (e) => {
  worker.initialize((ctx: any, createData: any) => {
    console.log('html worker onMessage', { ctx, e, createData })
    return new HTMLWorker(ctx, createData)
  })
}
