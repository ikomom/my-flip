import * as htmlService from 'vscode-html-languageservice'
import type { worker } from 'monaco-editor'
import { htmlCompletionPlugins } from '../../plugins/index'
// import type { worker } from './fillers/monaco-editor-core'

export interface ICreateData {
  languageId: string
  languageSettings: any
}

export class HTMLWorker {
  private _ctx: worker.IWorkerContext
  private _languageService: htmlService.LanguageService
  private _languageSettings: any
  private _languageId: string

  constructor(ctx: worker.IWorkerContext, createData: any) {
    this._ctx = ctx
    this._languageId = createData.languageId
    this._languageSettings = createData.languageSettings
    this._languageService = htmlService.getLanguageService()
  }

  doComplete(uri: string, position: htmlService.Position) {
    const document = this._getTextDocument(uri)
    const htmlDocument = this._languageService.parseHTMLDocument(document)

    const items = htmlCompletionPlugins.map(plugin => plugin.completions({ document, html: htmlDocument, position })).flat()
    const completions = this._languageService.doComplete(
      document,
      position,
      htmlDocument,
      this._languageSettings && this._languageSettings.suggest,
    )
    console.log('domComplete', { this: this, uri, document, completions, htmlDocument, position })

    return Promise.resolve({
      isIncomplete: true,
      items: [
        ...completions.items,
        ...items,
      ],
    })
  }

  async doHover(uri: string, position: htmlService.Position): Promise<htmlService.Hover> {
    const document = this._getTextDocument(uri)
    const htmlDocument = this._languageService.parseHTMLDocument(document)
    const hover = this._languageService.doHover(document, position, htmlDocument)
    console.log('doHover', hover)
    return Promise.resolve(hover!)
  }

  findDocumentLinks() {

  }

  findDocumentHighlights() {

  }

  getFoldingRanges() {}

  private _getTextDocument(uri: string): htmlService.TextDocument {
    const models = this._ctx.getMirrorModels()
    console.log('_getTextDocument', models)
    for (const model of models) {
      if (model.uri.toString() === uri) {
        return htmlService.TextDocument.create(
          uri,
          this._languageId,
          model.version,
          model.getValue(),
        )
      }
    }
    return null!
  }
}
