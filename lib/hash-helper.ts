import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password: string, input: string) => {
  return bcrypt.compare(password, input);
};
