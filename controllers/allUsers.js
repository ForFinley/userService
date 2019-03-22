module.exports.handler = async function(req, res) {
  console.log('Starting function allUsers...');
  try {
    let users = await docClient
      .scan({
        TableName: userTable
      })
      .promise();

    let result = {
      Items: users
    };
    return res.status(200).send(result);
  } catch (e) {
    console.log('**ERROR** ', e);
    return res.status(500).send('Internal Server Error.');
  }
};
