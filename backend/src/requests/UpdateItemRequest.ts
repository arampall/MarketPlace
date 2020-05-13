/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateItemRequest {
  description: string
  price: number
  condition: string
  isAvailable: boolean
}