const AWS = require('aws-sdk');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
  signatureVersion: 'v4'
});

const s3 = new AWS.S3({ signatureVersion: 'v4' });

const getAllImages = () => {
  const params = {
    Bucket: 'jrw192galleryapp',
    // MaxKeys: 1000 // This is the default and maximum allowed value
  };

  return s3.listObjectsV2(params).promise().then((objects) => {
    let objs = objects.Contents.map((obj) => {
      let signedUrlParams = {
        Bucket: 'jrw192galleryapp',
        Key: obj.Key,
        Expires: 100,
      }

      let imgObj = {
        key: obj.Key,
        url: s3.getSignedUrl('getObject', signedUrlParams),
      }

      // return s3.getSignedUrl('getObject', signedUrlParams);
      return imgObj;
    });
    return objs;
  });
}

const saveImage = (id, body) => {
    const uploadParams = {
      Bucket: 'jrw192galleryapp',
      Key: id,
      Body: body,
    };

    const command = new PutObjectCommand(uploadParams);
    return s3Client.send(command);
}

module.exports = {
  getAllImages,
  saveImage
};