const headers = {
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Credentials': true
};

function createResponse(status, body) {
  if (body instanceof Error) {
    body = { error: body.message };
  }
  return {
    statusCode: status,
    headers: headers,
    body: body
  }
};

module.exports = {
  createResponse
}