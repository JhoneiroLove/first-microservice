const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadFile = async (bucketName, key, body) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: body,
    };
    await s3.putObject(params).promise();
};

module.exports = { uploadFile };
