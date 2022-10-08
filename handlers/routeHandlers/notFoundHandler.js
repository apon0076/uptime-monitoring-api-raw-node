const handler = {};

handler.notFoundHandlers = (requestProperties, callback) => {
//   console.log(requestProperties);
  callback(404, { message: "Not Found" });
};

module.exports = handler;
