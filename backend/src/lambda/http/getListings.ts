import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {getAllItems} from '../../businessLogic/itemService'
//import {getUserId} from '../utils';
import { createLogger } from '../../utils/logger'
import { PaginationOutput } from '../../models/PaginationOutput';

const logger = createLogger('getAllItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const category: string = event.pathParameters.categoryName;
  // TODO: Implement get all items by category
  let nextKey:string// Next key to continue scan operation if necessary
  let limit: number // Maximum number of elements to return
  try {
    // Parse query parameters
    nextKey = parseNextKeyParameter(event);
    limit = parseLimitParameter(event) || 20;
  } catch (e) {
    console.log('Failed to parse query parameters: ', e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Invalid parameters'
      })
    }
  }
  console.log("In Method");
  logger.info('Starting to get all items');
  const result: PaginationOutput = await getAllItems(limit, nextKey) ; 

  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: result.items,
      nextKey: encodeNextKey(result.LastEvaluatedKey)
      
    })
  }
}

function parseLimitParameter(event) {
  const limitStr = getQueryParameter(event, 'limit')
  if (!limitStr) {
    return undefined
  }

  const limit = parseInt(limitStr, 10)
  if (limit <= 0) {
    throw new Error('Limit should be positive')
  }

  return limit
}

function parseNextKeyParameter(event) {
  const nextKeyStr = getQueryParameter(event, 'nextKey')
  if (!nextKeyStr) {
    return undefined
  }

  const uriDecoded = decodeURIComponent(nextKeyStr)
  return JSON.parse(uriDecoded)
}

function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}

function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}