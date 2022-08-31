import { resolve } from 'dns'

let uid = 1

export class PreviewProxy {
  iframe: HTMLIFrameElement
  // 请求中的命令
  pending_cmds: Map<number, { resolve: (value: unknown) => void; reject: (reason?: any) => void }>

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe
    this.pending_cmds = new Map()
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

  }
}
