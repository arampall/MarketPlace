import {ItemDB} from '../dataLayer/dbItems';
import { Item } from '../models/Item';
import { CreateItemRequest } from '../requests/CreateItemRequest';
import * as uuid from 'uuid';
import { UpdateItemRequest } from '../requests/UpdateItemRequest';
//import {getPreformedURL, getUploadUrl, removeImageFromS3} from '../s3/imageHandler';

const itemDB = new ItemDB();

export async function getItemsByCategory(category: string): Promise<Item[]>{
    return await itemDB.fetchAllItemsByCategory(category);
}

export async function createItem(
            requestItem: CreateItemRequest, userId: string): Promise<Item>{
    const itemId = uuid.v4();
    userId = uuid.v4();
    return await itemDB.createItem({
        userId: userId,
        itemId: itemId,
        createdAt: new Date().toISOString(),
        isAvailable: true,
        ...requestItem
    });
}

export async function updateItem(
            updateRequest: UpdateItemRequest, itemId: string, userId: string){
    await itemDB.updateItem(updateRequest, itemId, userId);
}

export async function deleteItem(itemId: string, userId: string){
    await itemDB.deleteItem(itemId, userId);
    //await removeImageFromS3(itemId);
}

/*export async function updateImage(todoId:string, userId: string): Promise<string>{
    const imageUrl =  getPreformedURL(todoId);
    await itemDB.updateImageUrl(imageUrl, todoId, userId);
    return getUploadUrl(todoId);
}*/
