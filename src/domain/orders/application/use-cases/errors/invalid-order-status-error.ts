import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidOrderStatusError extends Error implements UseCaseError {
  constructor(current: string, expected: string) {
    super(`Order status is "${current}" but "${expected}" was expected.`)
  }
}
