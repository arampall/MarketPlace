# Mini MarketPlace
This application provides a platform to buy and sell items without the involvement of third party. The seller can post the listing and they can be contacted by the interested people for further details.

## How to start the application:
1. Check out the project into a local directory.
2. Go to the client directory and execute the following command to install the dependencies.
```ts
cd client
npm i
```
3. Once the dependencies are installed, run the below command to start the application.
```ts
npm run start
```
# Functionality of the application

This application will allow creating/removing/updating/fetching user listings. Each item can optionally have an attachment image. Each user has access to modify/delete listings that he/she has created. Also the application allows access to see all the available items for sale without any authentication.

The application provides the major functionalities in two different screens or views.
1. All item listings:
    This screen displays all the items that are available for sale. Any user can checkout the items and contact the seller if            interested. This screen doesnot require any authentication and it is available to all.
2. My Listings: 
    This screen has all the listings created by a specific logged-in user. The user can create a new listing, add an image to the existing listing and delete a listing. Additionally, the user can make an item available/un-available.
    
## Database Model:
This project uses a dynamodb database to store all the listings data. Below is the data model of the db.
The application should store items added by user, and each item contains the following fields:

* `userId` (string) - a unique id for a registered user. 
* `itemId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - Type of the item to be listed (e.g. TV, Mobile, Table. Couch etc.)
* `description` (string) - High level summary of the item (e.g. TV for immediate sale etc.)
* `category` (string) - category into which the item belongs (currently supported :- Electronics, Furniture and Other)
* `categoryStatus` (string) - duplicate field for category used as the partition key for global sparse index.
* `condition` (string) - The condition of the item (New, Used-Good or Used).
* `price` (number) - The price of the item as expected by the seller.
* `isAvailable` (boolean) - true if an item is available for sale, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image of the item for sale.

This dynamodb table uses the userId as partition key and the itemId as the sort key. This datamodel helps to create transaction that can cater the following requests.
1. Create an Item.
2. Fetch all the items created by a user.
3. Edit the item availability.
4. Delete the item.
5. Add an image to a specific item.

### Global Index:
A global index is created to fetch all the items that are available for sale. The categoryStatus field is used as a partition key and the createdAt field is used as the sort key. 
Note: The category status field is only filled for items whose isAvailable flag is true. In this way, only available items will be stored in the index.

## Features:
All the api for features is configured using the serverless yaml file.

### Auth
A custom authorizer for API Gateway that validates all other functions.

### GetItemByCategory

### GetItemByUser
Returns all items for a current user. A user id can be extracted from a JWT token that is sent by the frontend

The response date format looks like this:

```json
{
  "items": [
    {
      "userId": "111",
      "itemId": "123",
      "name": "Headphones",
      "description": "Have HeadPhones to sell",
      "category": "Electronics",
      "categoryStatus": "Electronics",
      "condition": "New",
      "createdAt": "2020-05-19T07:20:51.583Z",      
      "isAvailable": true,
      "price": "80",
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

### CreateItem
Creates a new item for a current user. A shape of data send by a client application to this function can be found in the `CreateItemRequest.ts` file

It receives a new item to be created in JSON format that looks like this:

```json
{
  "name": "Bed Frame",
  "description": "Large King size bed frame for sale",
  "category": "Furniture",
  "price": 70,
  "condition": "Used-Good"
}
```

The response after creation of a new item looks like this:

```json
{
  "item": {
    "userId": "111",
    "todoId": "123",
    "name": "Bed Frame",
    "description": "Large King size bed frame for sale",
    "category": "Furniture",
    "categoryStatus": "Furniture",
    "price": 70,
    "condition": "Used-Good",
    "createdAt": "2020-05-27T20:01:45.424Z",
    "isAvailable": true
  }
}
```

### UpdateItem 
Updates the availability of an item created by the current user. A shape of data send by a client application to this function can be found in the `UpdateItemRequest.ts` file (TODO: Add more fields to be editable)

It receives an object that contains the following fields that can be updated in a listing (currently only the isAvailable field can be updated):

```json
{
  "description": "White Board for sale",
  "price": 50,
  "condition": "New",
  "isAvailable": false,
  "category": "Other"
}
```

The id of an item that should be updated is passed as a URL parameter.


### DeleteItem
Deletes an item created by a current user. Expects an id of a TODO item to remove. It returns an empty response.



### GenerateUploadUrl 
Returns a pre-signed URL that can be used to upload an attachment file for a listing.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.


# REST Endpoints:
[GET ALL ITEMS](#getitembycategory) - https://ce1rbv3fbd.execute-api.us-east-1.amazonaws.com/dev/category/{categoryName}/items  
[GET USER ITEMS](#getitembyuser) - https://ce1rbv3fbd.execute-api.us-east-1.amazonaws.com/dev/items   
[CREATE ITEM](#createitem) - https://ce1rbv3fbd.execute-api.us-east-1.amazonaws.com/dev/items   
[UPDATE ITEM](#updateitem) - https://ce1rbv3fbd.execute-api.us-east-1.amazonaws.com/dev/items/{itemId}   
[DELETE ITEM](#deleteitem) - https://ce1rbv3fbd.execute-api.us-east-1.amazonaws.com/dev/items/{itemId}   
[GENERATE UPLOAD URL](#generateuploadurl) - https://ce1rbv3fbd.execute-api.us-east-1.amazonaws.com/dev/items/{itemId}/attachment
