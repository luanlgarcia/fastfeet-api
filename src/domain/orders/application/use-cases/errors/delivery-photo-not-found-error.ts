import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliveryPhotoNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Delivery Photo not found`)
  }
}
