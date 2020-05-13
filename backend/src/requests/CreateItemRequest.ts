/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateItemRequest {
  name: string
  description: string
  category: string
  price: number
  condition: string
}
