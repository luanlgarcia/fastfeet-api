import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeleteAddresseeUseCase } from '@/domain/orders/application/use-cases/delete-addressee'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

@Controller('/addressees/')
export class DeleteAddresseeController {
  constructor(private deleteAddressee: DeleteAddresseeUseCase) {}

  @Delete(':id')
  @HttpCode(204)
  async handle(@Param('id') addresseeId: string) {
    const result = await this.deleteAddressee.execute({
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
