import { registerUser, loginUser } from '../services/auth-services.js';

const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const loginUserController = async (req, res) => {
  await loginUser(req.body);
};

export { registerUserController, loginUserController };
