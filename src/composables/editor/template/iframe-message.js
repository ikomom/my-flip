const scriptEls = []

function clearScript() {
  if (scriptEls.length)
    scriptEls.forEach(el => document.body.removeChild(el))
}

async function handle_message(ev) {
  console.log('handle_message', ev)
  const { action, cmd_id } = ev.data
  const send_message = payload => parent.postMessage({ ...payload }, ev.origin)
  const send_reply = payload => send_message({ ...payload, cmd_id })

  const send_ok = () => send_reply({ action: 'cmd_ok' })
  const send_error = (message, stack) => send_reply({ action: 'cmd_error', message, stack })

  // 解析脚本
  if (action === 'eval') {
    clearScript()

    let { script: scripts } = ev.data.args

    if (typeof scripts === 'string')
      scripts = [scripts]

    for (const script of scripts) {
      const scriptEl = document.createElement('script')
      scriptEl.setAttribute('type', 'module')
      scriptEl.innerHTML = `${script}\n window.__next__()`
      document.body.appendChild(scriptEl)
      scriptEl.onerror = err => send_error(err.message, err.stack)

      scriptEls.push(scriptEl)
      // 加载完夫脚本运行下一个
      await new Promise(resolve => window.__next__ = resolve)
    }
    window.__next__ = undefined
    send_ok()
  }
}

window.addEventListener('message', handle_message, false)
