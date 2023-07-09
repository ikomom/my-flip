import type { AxiosProgressEvent } from 'axios'
import axios from 'axios'

interface RequestOptions {
  fields: Record<string, any>
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void
}

export function uploadFiles(
  files: HTMLInputElement['files'],
  options?: Partial<RequestOptions>,
) {
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    formData.append('file', file)
  }
  if (options.fields) {
    for (const fieldsKey in options.fields)
      formData.append(fieldsKey, options.fields[fieldsKey])
  }
  return axios({
    // url: 'http://localhost:3000',
    url: '/api/upload',
    method: 'post',
    data: formData,
    headers: {
      // 'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: options.onUploadProgress,
  }).then(res => res.data)
}
