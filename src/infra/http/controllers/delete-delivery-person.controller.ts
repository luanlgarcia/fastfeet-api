import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/delete-delivery-person'
import { Roles } from '@/infra/auth/roles'
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/delivery-persons')
@Roles('ADMIN')
export class DeleteDeliveryPersonController {
  constructor(private deleteDeliveryPerson: DeleteDeliveryPersonUseCase) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(@Param('id') deliveryPersonId: string) {
    const result = await this.deleteDeliveryPerson.execute({
      deliveryPersonId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
