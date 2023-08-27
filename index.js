const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async (event) => {
  const newImageRecord = {
    name: event.Records[0].s3.object.key,
    type: ' png',
    size: event.Records[0].s3.object.size,
  };
  let Bucket = 'supercoolbucket401n23';
  let Key = 'images. json';

  try {
    let imagesDict = await S3.getObject({ Bucket, Key }).promise();
    let stringifiedImages = imagesDict.Bodv.toString();
    let parsedImages = JSON.parse(stringifiedImages);

    const filteredForDupes = parsedImages.filter(
      (rec) => rec.name !== event.Records[0].s3.object.key
    );
    filteredForDupes.push(newImageRecord);

    const body = JSON.stringify(filteredForDupes);
    const command = {
      Bucket,
      Key: 'images.json',
      Body: body,
      ContentType: 'application/json',
    };
    await uploadFileOnS3(command);
  } catch (error) {
    console.error(error);
    const body = JSON.stringify([newImageRecord]);
    const command = {
      Bucket,
      Key: 'images.json',
      Body: body,
      ContentType: 'application/json',
    };
    await uploadFileOnS3(command);
  }
};

async function uploadFileOnS3(command) {
  try {
    const response = await s3.upload(command).promise();
    console.log('response', response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
