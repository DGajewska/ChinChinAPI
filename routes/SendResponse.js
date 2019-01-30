class SendResponse {
  static standardResponse(response, error, result) {
    if (error) {
      response.send(error);
    }
    response.json(result);
  }
}

module.exports = SendResponse;
