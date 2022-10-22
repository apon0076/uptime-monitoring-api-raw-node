//dependencies
const data = require("./../../lib/data");
const { hash } = require("./../../helpers/utilities");
const { parseJSON } = require("./../../helpers/utilities");

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure user not exist
    data.read("users", phone, (err1) => {
      if (err1) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        //store user to db
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User Created Successfully!",
            });
          } else {
            callback(500, { error: "Could Not Create User!" });
          }
        });
      } else {
        callback(500, {
          error: "User Exist",
        });
      }
    });
  } else {
    callback(400, {
      error: "You Have a Problem in Your Request",
    });
  }
};
handler._users.get = (requestProperties, callback) => {
  //check the phone no if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    //read user
    data.read("users", phone, (err, data) => {
      const user = { ...parseJSON(data) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(400, {
          error: "User Not Found",
        });
      }
    });
  } else {
    callback(404, {
      error: "User not found",
    });
  }
};
handler._users.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      data.read("users", phone, (err1, uData) => {
        const userData = { ...parseJSON(uData) };
        if (!err1 && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          data.update("users", phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: "User Updated Successfully",
              });
            } else {
              callback(500, {
                error: "Server Side Problem",
              });
            }
          });
        } else {
          callback(400, {
            error: "You have problem with your request !",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have problem with your request !",
      });
    }
  } else {
    callback(400, {
      error: "Invalid Phone No",
    });
  }
};
handler._users.delete = (requestProperties, callback) => {
  callback(200);
};

module.exports = handler;
