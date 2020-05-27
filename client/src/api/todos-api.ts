import { apiEndpoint } from '../config'
import { Listing } from '../types/Listing';
import { CreateListingRequest } from '../types/CreateListingRequest';
import Axios from 'axios'
import { UpdateListingRequest } from '../types/UpdateListingRequest';
import {processImage} from '../utils/resizeImage';

export async function getItems(idToken: string): Promise<Listing[]> {
  console.log('Fetching User Listings')

  const response = await Axios.get(`${apiEndpoint}/items`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Listings:', response.data)
  return response.data.items
}

export async function getCategories(idToken: string): Promise<Listing[]> {
  console.log('Fetching All Categories')

  const response = await Axios.get(`${apiEndpoint}/categories`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('Categories:', response.data)
  return response.data.items
}

export async function getAllItems(category: string): Promise<Listing[]> {
  console.log('Fetching All Items from the category')
  const response = await Axios.get(`${apiEndpoint}/category/${category}/items`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('Listings:', response.data)
  return response.data.items
}

export async function createItem(
  idToken: string,
  newItem: CreateListingRequest
): Promise<Listing> {
  console.log(newItem);
  console.log(typeof(newItem.price));
  const response = await Axios.post(`${apiEndpoint}/items`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchItem(
  idToken: string,
  itemId: string,
  updatedItem: UpdateListingRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/items/${itemId}`, JSON.stringify(updatedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/items/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/items/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  const resizedImage = await processImage(file);
  console.log(resizedImage);
  await Axios.put(uploadUrl, resizedImage)
}
