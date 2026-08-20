import { ValueObject } from '@/core/entities/value-object'

export interface CoordinateProps {
  latitude: number
  longitude: number
}

export class Coordinate extends ValueObject<CoordinateProps> {
  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  static create(props: CoordinateProps) {
    return new Coordinate(props)
  }

  /** Retorna a distância em quilômetros. */
  distanceTo(other: Coordinate): number {
    if (
      this.latitude === other.latitude &&
      this.longitude === other.longitude
    ) {
      return 0
    }

    const fromRadian = (Math.PI * this.latitude) / 180
    const toRadian = (Math.PI * other.latitude) / 180

    const theta = this.longitude - other.longitude
    const radTheta = (Math.PI * theta) / 180

    let dist =
      Math.sin(fromRadian) * Math.sin(toRadian) +
      Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

    if (dist > 1) {
      dist = 1
    }

    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344

    return dist
  }
}
