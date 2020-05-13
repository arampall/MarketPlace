import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import {getUserId} from '../utils';
import {deleteItem} from '../../businessLogic/itemService';
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const itemId = event.pathParameters.itemId
  //const userId = getUserId(event);
  const userId = 'hello';
  // TODO: Remove a listing item by id
  logger.log('Removing Item with Id ', itemId);
  

  await deleteItem(itemId, userId);
  
  logger.log('Deleted the listing item with id ', itemId);

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: null
  }
}
