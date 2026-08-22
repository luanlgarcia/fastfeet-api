import { RegisterDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/register-delivery-person'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryPersonAlreadyExistsError } from '@/domain/orders/application/use-cases/errors/delivery-person-already-exists-error'
import { Roles } from '@/infra/auth/roles'

const cpfSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 11, {
    message: 'CPF must have exactly 11 digits',
  })

const creaeAccountBodySchema = z.object({
  cpf: cpfSchema,
  name: z.string().min(1),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof creaeAccountBodySchema>

@Controller('/accounts')
@Roles('ADMIN')
export class CreateAccountController {
  constructor(
    private registerDeliveryPersonUseCase: RegisterDeliveryPersonUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(creaeAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { cpf, name, password } = body

    const result = await this.registerDeliveryPersonUseCase.execute({
      cpf,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryPersonAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
