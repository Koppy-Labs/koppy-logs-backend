import { findUserByEmail, insertUser } from "@/db/repositories/users";
import type { InsertUserModel } from "@/domain/entities/user";
import { error, success } from "@/utils/api-response";
import { hashPassword } from "@/utils/password";

export async function createUserService({
  name,
  email,
  password,
  avatarUrl,
}: InsertUserModel) {
  const userWithSameEmail = await findUserByEmail({ email });

  if (userWithSameEmail)
    return error({
      message: "Email already in use",
      code: 400,
    });

  const hashedPassword = await hashPassword(password);

  await insertUser({ name, email, password: hashedPassword, avatarUrl });

  return success({
    data: null,
    code: 204,
  });
}
