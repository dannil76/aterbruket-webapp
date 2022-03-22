const AWS = require('aws-sdk');
const newAdvertTemplate = require('./templates/newRecycleAdvert');
const missingAccessoriesTemplate = require('./templates/missingAccessories');
const SES = new AWS.SES();
const UserPool = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

exports.handler = async (event) => {
  const appUrl = process.env.SES_APP_URL;
  const senderEmail = process.env.SES_SENDER_EMAIL;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;

  for (const streamedItem of event.Records) {
    const streamRecord = streamedItem.dynamodb;

    if (streamedItem.eventName === 'MODIFY' && streamRecord.NewImage.advertType.S === 'borrow') {
      const oldMissingAccessories = streamRecord.OldImage?.missingAccessories?.L ?? [];
      const newMissingAccessories = streamRecord.NewImage?.missingAccessories?.L ?? [];
      const hasNewMissingAccessories = newMissingAccessories.length > oldMissingAccessories.length;
      if (hasNewMissingAccessories) {
        await sendMissingAccessoryNotification(streamRecord, userPoolId, senderEmail);
      }
    }

    if (streamedItem.eventName === 'INSERT') {
      if (streamRecord.NewImage.version.N === '0') {
        let recipientEmail = streamRecord.NewImage.advertType.S === 'borrow' ? process.env.SES_BORROW_RECIPIENT_EMAIL : process.env.SES_RECYCLE_RECIPIENT_EMAIL;
        recipientEmail = recipientEmail.split(',');
        await sendNewAdvertNotification(streamRecord, appUrl, recipientEmail, senderEmail);
      }
    }

    return { status: 'done' }
  }
}

const getUserBySub = async (userPoolId, sub) => {
  const filter = `sub = "${sub}"`;
  const listUsers = await UserPool.listUsers({
    UserPoolId: userPoolId,
    Filter: filter,
    Limit: 1,
  }).promise();
  const user = listUsers?.Users?.[0] ?? {};
  const newUserObject = convertAwsUserToObject(user);
  return newUserObject;
}

const convertAwsUserToObject = (user) => {
  const newObject = {
    username: user.Username,
  }
  user.Attributes.forEach(attr => {
    newObject[attr.Name] = attr.Value;
  });
  return newObject;
}

const sendMissingAccessoryNotification = async (streamRecord, userPoolId, senderEmail) => {
  const latestReport = streamRecord.NewImage.missingAccessories.L.reduce((prev, curr) => {
    return prev.M.reportedDate.S > curr.M.reportedDate.S ? prev : curr;
  });
  const missingAccessories = latestReport.M.accessories.L.map(accessory => accessory.S).join(', ');
  const reportedByUser = await getUserBySub(userPoolId, latestReport.M.reportedBy.S);
  const lastReturnedByUser = await getUserBySub(userPoolId, latestReport.M.lastReturnedBy.S);

  const templateArgs = {
    title: streamRecord.NewImage.title.S,
    contactPerson: streamRecord.NewImage.contactPerson.S,
    missingAccessories: missingAccessories,
    reportedByUser,
    lastReturnedByUser,
  };
  const body = missingAccessoriesTemplate(templateArgs);

  return await SES.sendEmail({
    Destination: {
      ToAddresses: [streamRecord.NewImage.email.S],
    },
    Source: senderEmail,
    Message: {
      Subject: { Data: 'Notis från Haffa - ett tillbehör saknas!' },
      Body: {
        Html: { Data: body },
      },
    },
  }).promise();
}

const sendNewAdvertNotification = async (streamRecord, appUrl, recipients, senderEmail) => {
  const args = {
    url: appUrl,
    id: streamRecord.NewImage.id.S,
    contactPerson: streamRecord.NewImage.contactPerson.S,
    department: streamRecord.NewImage.department.S,
    address: streamRecord.NewImage.address.S,
    postalCode: streamRecord.NewImage.postalCode.S,
    email: streamRecord.NewImage.email.S,
    phoneNumber: streamRecord.NewImage.phoneNumber.S,
    city: streamRecord.NewImage.city.S,
  };

  const body = newAdvertTemplate(args);

  return await SES.sendEmail({
    Destination: {
      ToAddresses: recipients,
    },
    Source: senderEmail,
    Message: {
      Subject: { Data: 'Här är en QR-kod från Haffa-appen!' },
      Body: {
        Html: { Data: body },
      },
    },
  }).promise();
}
