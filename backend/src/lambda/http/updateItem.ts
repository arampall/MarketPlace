import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
//import {getUserId} from '../utils';
import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import {updateItem} from '../../businessLogic/itemService'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const itemId: string = event.pathParameters.itemId
  const updatedItem: UpdateItemRequest = JSON.parse(event.body)
  //const userId: string = getUserId(event);
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  logger.info('Updating the TODO object');
  const userId = 'hello';
  await updateItem(updatedItem, itemId, userId)
  
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body:null
  }
}
