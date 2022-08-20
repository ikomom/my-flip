const clients: any[] = []

// @ts-expect-error
self.onconnect = function (e: any) {
  const port = e.ports[0]
  clients.push(port)
  console.log('onconnect port', { self, port: e.ports, clients })
  port.addEventListener('message', (e: any) => {
    console.log('worker recieve msg', e.data)
    if (e.data.type === 'CLOSE') {
      const index = clients.findIndex(p => p === port)
      if (index !== -1)
        clients.splice(index, 1)
      console.log('closeed', index, clients)
    }
    else {
      for (let i = 0; i < clients.length; i++) {
        const eElement = clients[i]
        eElement.postMessage(e.data)
      }
    }
  })
  port.start()
}
