import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateOrderUseCase } from '@/domain/orders/application/use-cases/create-order'
import { Roles } from '@/infra/auth/roles'

const createOrderBodySchema = z.object({
  name: z.string().min(1),
  addresseeId: z.uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
@Roles('ADMIN')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateOrderBodySchema) {
    const { name, addresseeId } = body

    const result = await this.createOrder.execute({
      name,
      addresseeId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
