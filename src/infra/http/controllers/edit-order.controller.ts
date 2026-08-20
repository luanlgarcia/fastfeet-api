import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { EditOrderUseCase } from '@/domain/orders/application/use-cases/edit-order'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const editOrderBodySchema = z.object({
  name: z.string().min(1),
  addresseeId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@Controller('/orders/')
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put(':id')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('id') orderId: string,
  ) {
    const { name, addresseeId } = body

    const result = await this.editOrder.execute({
      name,
      orderId,
      addresseeId,
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
