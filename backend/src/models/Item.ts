
export interface Item {
  userId: string
  itemId: string
  createdAt: string
  name: string,
  description: string,
  category: string,
  categoryStatus: string,
  condition: string
  isAvailable: boolean
  price: number
  attachmentUrl?: string
}
