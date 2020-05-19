import * as AWS from 'aws-sdk';

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});

export function getUploadUrl(itemId: string){
    return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: itemId,
    Expires: urlExpiration
    });
}

export function getPreformedURL(itemId: string){
    return `https://${bucketName}.s3.amazonaws.com/${itemId}`
}

export async function removeImageFromS3(itemId: string){
    const params = {
        Bucket: bucketName,
        Key: itemId
    }
    try {
        await s3.headObject(params).promise()
        console.log("File Found in S3")
        try {
            await s3.deleteObject(params).promise()
            console.log("file deleted Successfully")
        }
        catch (err) {
            console.log("ERROR in file Deleting : " + JSON.stringify(err))
        }
    } catch (err) {
            console.log("File not Found ERROR : " + err.code)
    }
}
