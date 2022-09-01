import { resolve } from 'dns'

let uid = 1

export class PreviewProxy {
  iframe: HTMLIFrameElement
  handlers: Record<string, Function>
  // 请求中的命令
  pending_cmds: Map<number, { resolve: (value: unknown) => void; reject: (reason?: any) => void }>
  // 处理iframe命令
  handle_event: (e: any) => void

  constructor(iframe: HTMLIFrameElement, handlers: Record<string, Function>) {
    this.iframe = iframe
    this.handlers = handlers

    this.pending_cmds = new Map()

    this.handle_event = e => this.handle_repl_message(e)
    window.addEventListener('message', this.handle_event, false)
  }

  /**
   * 接收返回的信息
   * @param event
   */
  handle_repl_message(event: any) {
    if (event.source !== this.iframe.contentWindow)
      return
    const { action, args } = event.data
    switch (action) {
      case 'cmd_error':
      case 'cmd_ok':
        return this.handle_command_message(event.data)
      case 'error':
        return
      case 'unhandledrejection':
        return this.handlers.onUnhandledRejection(event.data)
    }
  }

  /**
   * 执行命令错误
   * @param cmd_data
   */
  handle_command_message(cmd_data: any) {
    const { action, cmd_id } = cmd_data
    const handler = this.pending_cmds.get(cmd_id)
    console.log('handleRepl', cmd_data)

    if (handler) {
      this.pending_cmds.delete(cmd_id)

      if (action === 'cmd_error') {
        const { message, stack } = cmd_data
        const e = new Error(message)
        e.stack = stack
        handler.reject(e)
      }

      if (action === 'cmd_ok')
        handler.resolve(cmd_data.args)
    }
  }

  /**
   * 发送命令到iframe
   * @param action
   * @param args
   */
  iframe_command(action: string, args: any) {
    return new Promise((resolve, reject) => {
      const cmd_id = uid++
      this.pending_cmds.set(cmd_id, { resolve, reject })
      this.iframe.contentWindow.postMessage({ action, cmd_id, args }, '*')
    })
  }

  /**
   * 解析脚本
   * @param script
   */
  eval(script: string | string[]) {
    return this.iframe_command('eval', { script })
  }

  destroy() {
    window.removeEventListener('message', this.handle_event)
  }
}
