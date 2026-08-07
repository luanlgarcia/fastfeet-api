import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Order "${identifier}" not found.`)
  }
}
