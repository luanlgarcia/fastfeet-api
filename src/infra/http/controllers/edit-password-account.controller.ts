import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditPasswordDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/edit-password-delivery-person'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Roles } from '@/infra/auth/roles'

const editPasswordAccountBodySchema = z.object({
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(editPasswordAccountBodySchema)

type EditPasswordAccountBodySchema = z.infer<
  typeof editPasswordAccountBodySchema
>

@Controller('/accounts')
@Roles('ADMIN')
export class EditPasswordAccountController {
  constructor(
    private editPasswordDeliveryPerson: EditPasswordDeliveryPersonUseCase,
  ) {}

  @Patch(':id/reset-password')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditPasswordAccountBodySchema,
    @Param('id') accountId: string,
  ) {
    const { password } = body

    const result = await this.editPasswordDeliveryPerson.execute({
      deliveryPersonId: accountId,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
