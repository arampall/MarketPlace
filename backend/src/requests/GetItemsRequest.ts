import { DocumentClient } from "aws-sdk/clients/dynamodb";

/**
 * Fields in a request to create a single TODO item.
 */
export interface GetItemsRequest {
    limit: number,
    nextKey: DocumentClient.Key
  }
  