import axios from 'axios'

export function uploadFiles(files: HTMLInputElement['files']) {
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    formData.append('files', file)
  }
  return axios({
    // url: 'http://localhost:3000',
    url: '/api/upload',
    method: 'post',
    data: formData,
    headers: {
      // 'Content-Type': 'multipart/form-data',
    },
    onUploadProgress(ev) {
      console.log('ev', ev)
    },
  }).then(res => res.data)
}
