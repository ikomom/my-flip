import { VERIFY_FILE_API } from '~/pages/comp/modules/uploader/constant'
import { ajax, ajax4Upload } from '~/pages/comp/modules/uploader/Request'
import type { FileChunk } from '~/utils/fileUtils'
import { calculateFileHash, createFileChunk } from '~/utils/fileUtils'

type chunkListType = FileChunk[]

interface ProgressHandlerParams {
  percentage: number
  loaded: number
  //
  total: number
  // 进度详情
  progressDetail: chunkListType

}
interface HandlerParams {
  uploadTime: number
  hashTime: number
}
type ProgressHandler = null | ((params: ProgressHandlerParams) => void)
type HandlerType = null | ((params: HandlerParams) => void)
type HandlerErrorType = null | ((error: any) => void)

const defaultUploader = {
  showProgress: false,
  enableSlice: false,
}

export default class Uploader {
  // 上传地址
  uploaderUrl: string
  // 显示进度条
  showProgress: boolean
  // 是否文件切片
  enableSlice: boolean
  // 自定义进度处理函数
  private customProgressHandler: ProgressHandler = null
  // 自定义请求结束处理函数
  private customCompleteHandler: HandlerType = null
  // 自定义错误请求
  private customErrorHandler: HandlerErrorType = null
  // 文件大小
  private length = 0
  // 切片请求, 用于断点传续
  private requestList: any[] = []
  // 切片详情
  private chunkList: chunkListType = []
  // 上传耗时
  private uploadTime: number | null = null
  // 计算Hash耗时
  private calHashTime: number | null = null

  constructor(url: string, options?: Partial<typeof defaultUploader>) {
    this.uploaderUrl = url
    this.showProgress = options?.showProgress || false
    this.enableSlice = options?.enableSlice || false
  }

  /**
   * 设置进度的自定义处理函数
   * @param fn
   * @returns {Uploader}
   */
  public onProgress = (fn: ProgressHandler) => {
    this.customProgressHandler = fn
    return this
  }

  /**
   * 请求结束自定义处理函数
   * @param fn
   * @returns {Uploader}
   */
  public onComplete = (fn: HandlerType) => {
    this.customCompleteHandler = fn
    return this
  }

  public onError = (fn: HandlerType) => {
    this.customErrorHandler = fn
    return this
  }

  /**
   * 在切片上传中算进程
   */
  private calcProcessInSliceMode = () => {
    // 计算一个总的百分比
    let loadedSum = 0
    this.chunkList.forEach(({ progress = null }) => {
      if (progress)
        loadedSum += progress.loaded
    })

    if (this.customProgressHandler) {
      this.customProgressHandler({
        percentage: parseInt(String(loadedSum / this.length * 100), 10),
        loaded: loadedSum,
        total: this.length,
        progressDetail: this.chunkList,
      })
    }
  }

  private onUploadProgressHandler = (chunkFile: File, e: any) => {
    console.log('onProgressHandler', chunkFile, e)
  }

  private uploadFile = (file: File) => {
    console.log('upload file', this)
    const formData = new FormData()
    const startTime = new Date().getTime()
    formData.append('file', file)
    ajax4Upload({
      method: 'POST',
      url: this.uploaderUrl,
      data: formData,
      onUploadProgress: e => this.onUploadProgressHandler(file, e),
    }).then(() => {
      const endTime = new Date().getTime()
      this.uploadTime = parseInt(String((endTime - startTime) / 10)) / 100
      if (this.customCompleteHandler) {
        this.customCompleteHandler({
          uploadTime: this.uploadTime,
          hashTime: this.calHashTime,
        })
      }
    })
  }

  verifyHash(fileSize: number, contentHash: string) {
    const formData = new FormData()
    formData.append('fileSize', `${fileSize}`)
    formData.append('contentHash', contentHash)

    return ajax({
      method: 'POST',
      url: VERIFY_FILE_API,
      data: formData,
    })
  }

  private uploadSliceFile = (file: File) => {
    const chunkList = createFileChunk(file)
    console.log(chunkList)
    this.chunkList = chunkList
    calculateFileHash(chunkList)
      .then((res) => {
        this.calHashTime = res.time
        console.log('calculateFileHash', res)
        this.verifyHash(this.length, res.hash).then((res) => {
          console.log('verifyHash', res)
        })
      })
  }

  public upload = (file: File) => {
    this.length = file.size
    if (this.enableSlice)
      this.uploadSliceFile(file)
    else
      this.uploadFile(file)

    return this
  }
}
