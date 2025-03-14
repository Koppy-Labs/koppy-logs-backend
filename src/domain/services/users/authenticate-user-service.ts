import { findUserByEmail } from '@/db/repositories/users'
import { error, success } from '@/utils/api-response'
import { signJwtToken } from '@/utils/jwt'
import { comparePassword } from '@/utils/password'

interface AuthenticateUserService {
  email: string
  password: string
}

export async function authenticateUserService({
  email,
  password,
}: AuthenticateUserService) {
  const user = await findUserByEmail({ email })

  if (!user) {
    return error({
      message: 'Invalid credentials',
      code: 401,
    })
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    return error({
      message: 'Invalid credentials',
      code: 401,
    })
  }

  const token = await signJwtToken({ sub: user.id })

  return success({
    data: token,
    code: 200,
  })
}
