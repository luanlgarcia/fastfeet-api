import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderWithoutAddresseeError extends Error implements UseCaseError {
  constructor(orderName: string) {
    super(`Order "${orderName}" has no valid addressee.`)
  }
}
