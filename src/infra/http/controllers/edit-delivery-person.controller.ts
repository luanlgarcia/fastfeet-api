import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { EditDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/edit-delivery-person'
import { Roles } from '@/infra/auth/roles'

const editDeliveryPersonBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliveryPersonBodySchema)

type EditDeliveryPersonBodySchema = z.infer<typeof editDeliveryPersonBodySchema>

@Controller('/delivery-persons')
@Roles('ADMIN')
export class EditDeliveryPersonController {
  constructor(private editDeliveryPerson: EditDeliveryPersonUseCase) {}

  @Put('/:id')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryPersonBodySchema,
    @Param('id') deliveryPersonId: string,
  ) {
    const { name } = body

    const result = await this.editDeliveryPerson.execute({
      name,
      deliveryPersonId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
