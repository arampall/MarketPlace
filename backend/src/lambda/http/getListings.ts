import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {getItemsByCategory} from '../../businessLogic/itemService'
import { Item } from '../../models/Item';
//import {getUserId} from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getAllItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const category: string = event.pathParameters.categoryName;
  // TODO: Implement get all items by category
  console.log("In Method");
  logger.info('Starting to get all items by category');
  const items: Item[] = await getItemsByCategory(category) ; 

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