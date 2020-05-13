import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createItem} from '../../businessLogic/itemService'
import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { Item } from '../../models/Item';
//import {getUserId} from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('createItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newItem: CreateItemRequest = JSON.parse(event.body)
  logger.info('Event ', event.body);
  // TODO: Implement creating a new item
  console.log("In Method");
  logger.info('Starting to create a new item');
  const userId: string = "hello"
  const item: Item = await createItem(newItem, userId); 

  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
      
    })
  }
}