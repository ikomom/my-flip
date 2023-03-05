import axios from 'axios'
export const apiMockUrl = 'https://eyzy4.mocklab.io/json/1'
export const apiMockUrl2 = 'https://eyzy4.mocklab.io/thing/8'

export const apiMockJson = () => {
  return axios.get(apiMockUrl).then((res) => {
    // toast.success('success')
    console.log('mock', res)
    return res
  })
}
