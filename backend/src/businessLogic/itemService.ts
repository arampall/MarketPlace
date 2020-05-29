import {ItemDB} from '../dataLayer/dbItems';
import { Item} from '../models/Item';
import {Category} from '../models/Category';
import {PaginationOutput} from '../models/PaginationOutput';
import { CreateItemRequest } from '../requests/CreateItemRequest';
import * as uuid from 'uuid';
import { UpdateItemRequest } from '../requests/UpdateItemRequest';
import {getPreformedURL, getUploadUrl, removeImageFromS3} from '../s3/imageHandler';

const image_placeholder_url = process.env.IMAGE_PLACEHOLDER_URL;

const itemDB = new ItemDB();

export async function getAllCategories(): Promise<Category[]>{
    return await itemDB.fetchAllCategories();
}

export async function getAllItems(limit: number, nextKey: any): Promise<PaginationOutput>{
    return await itemDB.fetchAllItemsWithPagination(limit, nextKey);
}

export async function getItemsByCategory(category: string): Promise<Item[]>{
    return await itemDB.fetchAllItemsByCategory(category, "true");
}

export async function getItemsByUser(userId: string): Promise<Item[]>{
    return await itemDB.fetchAllItemsByUser(userId);
}

export async function createItem(
            requestItem: CreateItemRequest, userId: string): Promise<Item>{
    const itemId = uuid.v4();
    return await itemDB.createItem({
        userId: userId,
        itemId: itemId,
        createdAt: new Date().toISOString(),
        isAvailable: false,
        attachmentUrl: image_placeholder_url,
        categoryStatus: requestItem.category,
        ...requestItem
    });
}

export async function updateItem(
            updateRequest: UpdateItemRequest, itemId: string, userId: string){
    await itemDB.updateItemAvailability(updateRequest, itemId, userId);
    (updateRequest.isAvailable ? 
        await itemDB.addCategoryStatus(updateRequest.category, itemId, userId) :
        await itemDB.removeCategoryStatus(itemId, userId))
}

export async function deleteItem(itemId: string, userId: string){
    await itemDB.deleteItem(itemId, userId);
    await removeImageFromS3(itemId);
}

export async function updateImage(itemId:string, userId: string): Promise<string>{
    const imageUrl =  getPreformedURL(itemId);
    await itemDB.updateImageUrl(imageUrl, itemId, userId);
    return getUploadUrl(itemId);
}
