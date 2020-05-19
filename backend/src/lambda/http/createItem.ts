import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {createItem} from '../../businessLogic/itemService'
import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { Item } from '../../models/Item';
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';

const logger = createLogger('createItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newItem: CreateItemRequest = JSON.parse(event.body)
  logger.info(event.body);
  // TODO: Implement creating a new item
  console.log('New Item', newItem);
  logger.info('Starting to create a new item');
  const userId: string = getUserId(event)
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