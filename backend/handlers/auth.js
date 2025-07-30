const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Validator } = require("node-input-validator");
const {
  create,
  getByEmail,
  setNewPassword,
  countAdmins,
} = require("../pkg/account");
const {
  AccountLogin,
  AccountRegister,
  AccountReset,
  AccountForgot,
  validate,
} = require("../pkg/account/validate");
const { sendForgotPasswordEmail } = require("./mailer");

const login = async (req, res) => {
  try {
    await validate(req.body, AccountLogin);
    const { email, password } = req.body;
    const account = await getByEmail(email);

    if (!account) return res.status(400).send("Account not found!");
    if (!bcrypt.compareSync(password, account.password))
      return res.status(400).send("Wrong password!");

    const payload = {
      fullName: account.fullName,
      email: account.email,
      id: account._id,
      exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).send({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal Server Error");
  }
};

const register = async (req, res) => {
  try {
    await validate(req.body, AccountRegister);
    const { email, password, confirmPassword } = req.body;

    // број на админи
    const adminCount = await countAdmins();
    if (adminCount >= 2) {
      return res.status(403).send("Maximum number of admins reached.");
    }

    const exists = await getByEmail(email);

    if (exists)
      return res.status(400).send("Account with this email already exists!");
    if (password !== confirmPassword)
      return res
        .status(400)
        .send("Confirmed password is not the same as password!");

    req.body.password = bcrypt.hashSync(password);
    const acc = await create(req.body);
    return res.status(201).send(acc);
  } catch (err) {
    console.log(err);
    return res
      .status(err.status || 500)
      .send(err.error || "Internal Server Error");
  }
};

const refreshToken = async (req, res) => {
  const payload = {
    ...req.auth,
    exp: new Date().getTime() / 1000 + 7 * 24 * 60 * 60,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return res.send({ token });
};

const resetPassword = async (req, res) => {
  await validate(req.body, AccountReset);
  const { email, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).send("Новата лозинка и потврдата не се совпаѓаат!");
  }

  const account = await getByEmail(email);
  if (!account) {
    return res.status(400).send("Сметка со овој емаил не постои!");
  }

  if (bcrypt.compareSync(newPassword, account.password)) {
    return res
      .status(400)
      .send("Новата лозинка не може да биде иста како старата!");
  }

  const newPasswordHashed = bcrypt.hashSync(newPassword);
  const userPasswordChanged = await setNewPassword(
    account._id.toString(),
    newPasswordHashed
  );

  return res.status(200).send("Лозинката е успешно променета!");
};

const forgotPassword = async (req, res) => {
  try {
    await validate(req.body, AccountForgot);

    const account = await getByEmail(req.body.email);
    if (!account)
      return res.status(400).send("Account with this email does not exist!");

    const resetLink = `${
      process.env.FRONTEND_URL
    }/reset-password?email=${encodeURIComponent(account.email)}`;

    await sendForgotPasswordEmail(account.email, resetLink);

    return res.send("OK");
  } catch (err) {
    console.log("Forgot password error:", err);
    return res
      .status(err.code || 500)
      .send(err.error || "Internal Server Error");
  }
};
module.exports = {
  login,
  register,
  resetPassword,
  forgotPassword,
  refreshToken,
};
