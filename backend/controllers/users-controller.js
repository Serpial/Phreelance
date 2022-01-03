const ErrorWithCode = require("../models/error-with-code");

let DUMMY_USERS = [
  {
    userId: "u1",
    name: "Paul",
    email: "test@test.com",
    password: "tester",
  },
];

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (DUMMY_USERS.find(u => u.email === email)) {
    return next(new ErrorWithCode("Cannot use this email address!", 409));
  }

  const newUser = {
    userId: "u2",
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);
  res.json(newUser);
};

const loginUser = (req, res, next) => {
  const {email, password} = req.body;
  const user = DUMMY_USERS.find(u => u.email === email);
  if (!user || user.password !== password) {
    return next(new ErrorWithCode("Cannot use this email address!", 401));
  }

  res.json({message: "Loggin successful!"});
}

exports.createUser = createUser;
exports.loginUser = loginUser;
