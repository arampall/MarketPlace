import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {getItemsByUser} from '../../businessLogic/itemService'
import { Item } from '../../models/Item';
import {getUserId} from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getItemsForUser')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Implement get all items by category
  console.log("In Method");
  logger.info('Starting to get all items by category');
  const userId = getUserId(event);
  const items: Item[] = await getItemsByUser(userId) ; 

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
      
    })
  }
}