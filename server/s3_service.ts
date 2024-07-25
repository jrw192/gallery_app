const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: 'AKIAQE3ROK6BP335SDEA',
  secretAccessKey: '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',
  region: 'us-east-1',
  signatureVersion: 'v4'
});

const s3 = new AWS.S3({ signatureVersion: 'v4' });

const getAllImages = () => {
  const params = {
    Bucket: 'jrw192galleryapp',
    // MaxKeys: 1000 // This is the default and maximum allowed value
  };

  return s3.listObjectsV2(params).promise().then((objects) => {
    let urls = objects.Contents.map((obj) => {
      console.log('obj.Key: ', obj.Key);
      let signedUrlParams = {
        Bucket: 'jrw192galleryapp',
        Key: obj.Key,
        Expires: 100,
      }

      return s3.getSignedUrl('getObject', signedUrlParams);
    });
    return urls;
  });
}

module.exports = {
  getAllImages
};