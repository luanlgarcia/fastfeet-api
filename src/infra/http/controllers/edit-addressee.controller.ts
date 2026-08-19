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
import { EditAddresseeUseCase } from '@/domain/orders/application/use-cases/edit-addressee'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

const postalCodeSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 8, {
    message: 'Postal code must have 8 digits',
  })

const editAddresseeBodySchema = z.object({
  name: z.string().min(1),
  street: z.string().min(1),
  number: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  postalCode: postalCodeSchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

const bodyValidationPipe = new ZodValidationPipe(editAddresseeBodySchema)

type EditAddresseeBodySchema = z.infer<typeof editAddresseeBodySchema>

@Controller('/addressees/')
export class EditAddresseeController {
  constructor(private editAddressee: EditAddresseeUseCase) {}

  @Put(':id')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAddresseeBodySchema,
    @Param('id') addresseeId: string,
  ) {
    const {
      name,
      city,
      latitude,
      longitude,
      number,
      postalCode,
      state,
      street,
    } = body

    const result = await this.editAddressee.execute({
      name,
      addresseeId,
      city,
      latitude,
      longitude,
      number,
      postalCode,
      state,
      street,
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
