import { AuthenticateDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/authenticate-delivery-person'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/orders/application/use-cases/errors/wrong-credentials-error'
import { AuthenticateAdminUseCase } from '@/domain/orders/application/use-cases/authenticate-admin'

const cpfSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 11, {
    message: 'CPF must have exactly 11 digits',
  })

const authenticateBodySchema = z.object({
  cpf: cpfSchema,
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateCrontroller {
  constructor(
    private authenticateDeliveryPersonUseCase: AuthenticateDeliveryPersonUseCase,
    private authenticateAdminUseCase: AuthenticateAdminUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const adminResult = await this.authenticateAdminUseCase.execute({
      cpf,
      password,
    })

    if (adminResult.isRight()) {
      return { access_token: adminResult.value.accessToken }
    }

    const result = await this.authenticateDeliveryPersonUseCase.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
