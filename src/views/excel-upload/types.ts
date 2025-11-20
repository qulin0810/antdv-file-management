export interface UploadHistory {
  id: string
  fileName: string
  fileSize: number
  description: string
  uploadTime: string
  status: 'success' | 'failed'
}