import { GetAddresseeUseCase } from '@/domain/orders/application/use-cases/get-addressee-by-id'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { AddresseePresenter } from '../presenters/addressee-presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Roles } from '@/infra/auth/roles'

@Controller('/addressees')
@Roles('ADMIN')
export class GetAddresseeByIdController {
  constructor(private getAddresseeById: GetAddresseeUseCase) {}

  @Get(':id')
  async handle(@Param('id') addresseeId: string) {
    const result = await this.getAddresseeById.execute({
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

    return { addressee: AddresseePresenter.toHTTP(result.value.addressee) }
  }
}
