import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateAddresseeUseCase } from '@/domain/orders/application/use-cases/create-addressee'

const postalCodeSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 8, {
    message: 'Postal code must have 8 digits',
  })

const createAddresseeBodySchema = z.object({
  name: z.string().min(1),
  street: z.string().min(1),
  number: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  postalCode: postalCodeSchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

const bodyValidationPipe = new ZodValidationPipe(createAddresseeBodySchema)

type CreateAddresseeBodySchema = z.infer<typeof createAddresseeBodySchema>

@Controller('/addressees')
export class CreateAddresseeController {
  constructor(private createAddressee: CreateAddresseeUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateAddresseeBodySchema) {
    const {
      city,
      latitude,
      longitude,
      name,
      number,
      postalCode,
      state,
      street,
    } = body

    const result = await this.createAddressee.execute({
      city,
      latitude,
      longitude,
      name,
      number,
      postalCode,
      state,
      street,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
