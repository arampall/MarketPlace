export interface Listing {
  userId: string
  itemId: string
  createdAt: string
  name: string,
  description: string,
  category: string,
  condition: string
  isAvailable: boolean
  price: number
  attachmentUrl?: string
}
