import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/get-delivery-person-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeliveryPersonPresenter } from '../presenters/delivery-person-presenter'
import { Roles } from '@/infra/auth/roles'

@Controller('/delivery-persons')
@Roles('ADMIN')
export class GetDeliveryPersonByIdController {
  constructor(private getDeliveryPersonById: GetDeliveryPersonUseCase) {}

  @Get('/:id')
  async handle(@Param('id') deliveryPersonId: string) {
    const result = await this.getDeliveryPersonById.execute({
      deliveryPersonId,
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

    return {
      deliveryPerson: DeliveryPersonPresenter.toHTTP(
        result.value.deliveryPerson,
      ),
    }
  }
}
