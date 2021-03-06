import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {getAllCategories} from '../../businessLogic/itemService';
import {Category} from '../../models/Category';
import { createLogger } from '../../utils/logger'

const logger = createLogger('getAllCategories')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Implement get all categories
  logger.info('Starting to get all categories');
  logger.info("processing event", event);
  const items: Category[] = await getAllCategories() ; 

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