export class UploadFileChunk {
  chunkHash: string
  fileHash: string

  constructor(
    public id: string,
    public chunk: Blob,
  ) {
  }
}
