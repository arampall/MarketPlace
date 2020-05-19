import * as AWS from 'aws-sdk';
import {Item} from '../models/Item';
import { DocumentClient} from 'aws-sdk/clients/dynamodb';
import { ItemUpdate } from '../models/ItemUpdate';
import {Category} from '../models/Category';
import { PaginationOutput } from '../models/PaginationOutput';

export class ItemDB {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly categoriesTable = process.env.CATEGORIES_TABLE,
        private readonly itemsTable = process.env.ITEMS_TABLE,
        private readonly categoryIndex = process.env.ITEM_CATEGORY_INDEX){
    };

    async fetchAllCategories(): Promise<Category[]>{
      const result = await this.docClient
      .scan({
        TableName: this.categoriesTable
      }).promise()
      return result.Items as Category[];
    }

    async fetchAllItemsWithPagination(limit: number, nextKey: any): Promise<PaginationOutput>{
      console.log(nextKey);
      const result = await this.docClient
      .scan({
        TableName: this.itemsTable,
        IndexName: this.categoryIndex,
        Limit: limit,
        ExclusiveStartKey: nextKey
      }).promise()
      return {
        items: result.Items as Item[],
        LastEvaluatedKey: result.LastEvaluatedKey
      };
    }

    async fetchAllItemsByCategory(category: string, statusId: string): Promise<Item[]>{
        console.log(category);
        const result = await this.docClient
        .query({
            TableName: this.itemsTable,
            IndexName: this.categoryIndex,
            KeyConditionExpression: 'status = :itemStatus',
            ExpressionAttributeValues: {
            ':statusId' : statusId,
            }
        }).promise();
        return result.Items as Item[];
    }

    async fetchAllItemsByUser(userId: string): Promise<Item[]>{
      const result = await this.docClient
      .query({
          TableName: this.itemsTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
          ':userId': userId
          }
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
    
    async updateItemAvailability(item: ItemUpdate, itemId: string, userId: string){ 
        await this.docClient.update({
            TableName: this.itemsTable,
            Key: {
              "userId": userId,
              "itemId": itemId
            },
            UpdateExpression: "set #itemIsAvailable = :updatedIsAvailable",
            ExpressionAttributeValues: {
              ':updatedIsAvailable' : item.isAvailable
            },
            ExpressionAttributeNames:{
              '#itemIsAvailable':'isAvailable',
            }
        }).promise();
    }

    async addCategoryStatus(categoryStatus: string, itemId: string, userId: string){ 
      console.log("In add");
      await this.docClient.update({
          TableName: this.itemsTable,
          Key: {
            "userId": userId,
            "itemId": itemId
          },
          UpdateExpression: "set #itemCategoryStatus = :updatedCategoryStatus",
          ExpressionAttributeValues: {
            ':updatedCategoryStatus' : categoryStatus
          },
          ExpressionAttributeNames:{
            '#itemCategoryStatus':'categoryStatus',
          }
      }).promise();
    }

  async removeCategoryStatus(itemId: string, userId: string){ 
    console.log("In remove");
    await this.docClient.update({
        TableName: this.itemsTable,
        Key: {
          "userId": userId,
          "itemId": itemId
        },
        UpdateExpression: "remove #itemCategoryStatus",
        ExpressionAttributeNames:{
          '#itemCategoryStatus':'categoryStatus'
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
              "itemId": itemId
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



