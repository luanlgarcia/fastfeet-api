import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliveryPersonNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Delivery person "${identifier}" not found.`)
  }
}
