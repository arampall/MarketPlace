import {Item} from './Item';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
export interface PaginationOutput {
    items: Item[]
    LastEvaluatedKey: DocumentClient.Key
  }
  