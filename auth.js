const userModel = require('../models/user');
const StatusCodes = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  /* This method below of hashing the password is done directly. But it looks clumsy - we can use mongoose middleware to eliminate
  all this commented password hashing code below. - check the user schema, to see the mongoose middleware in action.*/

  // const { name, email, password } = req.body;
  // // if (!name || !email || !password) {
  // //   throw new BadRequestError('please input name, email and password');
  // // }
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);
  // const tempUser = { name: name, email: email, password: hashedPassword };

  // const user = await userModel.create({ ...req.body });
  const user = await userModel.create({ ...req.body });

  // // using normal code method
  // const token = jwt.sign({ userId: user._id, name: user.name }, 'jwt-secret', {
  //   expiresIn: '30d',
  // });

  // using mongoose instance methods to keep controller cleaner
  const token = user.createJWT();

  /* all you ideally need is the token for the purpose of verification. But the peculiarity of this project
  will need to retrieve the username as well */
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('please insert email and password');
  }

  /// checking for the user
  const user = await userModel.findOne({ email });

  // compare user
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials submitted');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('invalid credentials');
  }

  // using mongoose instance methods to keep controller cleaner
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { user: user.getName() }, token });
};

module.exports = {
  register,
  login,
};
