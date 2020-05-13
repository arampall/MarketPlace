import * as AWS from 'aws-sdk';
import {Item} from '../models/Item';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ItemUpdate } from '../models/ItemUpdate';

export class ItemDB {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly itemsTable = process.env.ITEMS_TABLE,
        private readonly categoryIndex = process.env.ITEM_CATEGORY_INDEX){
    };

    async fetchAllItemsByCategory(category: string): Promise<Item[]>{
        const result = await this.docClient
        .query({
            TableName: this.itemsTable,
            IndexName: this.categoryIndex,
            KeyConditionExpression: 'category = :categoryName',
            ExpressionAttributeValues: {
            ':categoryName': category
            },
            ScanIndexForward: false,
        }).promise();
        return result.Items as Item[];
    }

    async createItem(item: Item): Promise<Item>{
        await this.docClient.put({
            TableName: this.itemsTable,
            Item: item
          }).promise();
        return item;
    }
    
    async updateItem(item: ItemUpdate, itemId: string, userId: string){ 
        await this.docClient.update({
            TableName: this.itemsTable,
            Key: {
              "userId": userId,
              "itemId": itemId
            },
            UpdateExpression: "set #itemDescription = :updatedDescription, #itemprice = :updatedPrice, \
                                #itemIsAvailable = :updatedIsAvailable, #itemCondition = :updatedCondition",
            ExpressionAttributeValues: {
              ':updatedDescription' : item.description,
              ':updatedPrice' : item.price,
              ':updatedIsAvailable' : item.isAvailable,
              ':updatedCondition' : item.condition
            },
            ExpressionAttributeNames:{
              '#itemDescription': 'description',
              '#itemprice': 'price',
              '#itemIsAvailable':'isAvailable',
              '#itemCondition': 'condition'
            }
        }).promise();
    }
    
    async deleteItem(itemId: string, userId: string){
        await this.docClient.delete({
            TableName: this.itemsTable,
            Key: {
              userId,
              itemId
            }
        }).promise();
    }
    
    async updateImageUrl(imageUrl: string, itemId: string, userId: string): Promise<void>{
        await this.docClient.update({
            TableName: this.itemsTable,
            Key: {
              "userId": userId,
              "todoId": itemId
            },
            UpdateExpression: "set #itemUrl = :url",
            ExpressionAttributeValues: {
              ':url' : imageUrl
            },
            ExpressionAttributeNames:{
              '#itemUrl': 'attachmentUrl'
            }
          }).promise();
        
    }
    
};



