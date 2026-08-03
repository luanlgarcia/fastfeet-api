import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AddresseeProps {
  name: string
  street: string
  number: string
  city: string
  state: string
  postalCode: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Addressee extends Entity<AddresseeProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  get street() {
    return this.props.street
  }

  set street(street: string) {
    this.props.street = street

    this.touch()
  }

  get number() {
    return this.props.number
  }

  set number(number: string) {
    this.props.number = number

    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city

    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state

    this.touch()
  }

  get postalCode() {
    return this.props.postalCode
  }

  set postalCode(postalCode: string) {
    this.props.postalCode = postalCode

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AddresseeProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const addressee = new Addressee(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return addressee
  }
}
