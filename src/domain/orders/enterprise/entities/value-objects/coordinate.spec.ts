import { Coordinate } from './coordinate'

const seSaoPaulo = Coordinate.create({
  latitude: -23.5505,
  longitude: -46.6333,
})

const centroRioDeJaneiro = Coordinate.create({
  latitude: -22.9068,
  longitude: -43.1729,
})

const avenidaPaulista = Coordinate.create({
  latitude: -23.5613,
  longitude: -46.6565,
})

const parqueIbirapuera = Coordinate.create({
  latitude: -23.5874,
  longitude: -46.6576,
})

describe('Coordinate', () => {
  it('should return zero when both coordinates are the same', () => {
    expect(seSaoPaulo.distanceTo(seSaoPaulo)).toBe(0)
  })

  it('should calculate the distance in kilometers between two coordinates', () => {
    const distance = seSaoPaulo.distanceTo(centroRioDeJaneiro)

    // São Paulo -> Rio de Janeiro em linha reta: ~360 km
    expect(distance).toBeGreaterThan(355)
    expect(distance).toBeLessThan(365)
  })

  it('should calculate short distances between nearby coordinates', () => {
    const distance = avenidaPaulista.distanceTo(parqueIbirapuera)

    // Av. Paulista -> Parque Ibirapuera: ~3 km
    expect(distance).toBeGreaterThan(2.5)
    expect(distance).toBeLessThan(3.5)
  })

  it('should return the same distance regardless of the direction', () => {
    expect(seSaoPaulo.distanceTo(centroRioDeJaneiro)).toBeCloseTo(
      centroRioDeJaneiro.distanceTo(seSaoPaulo),
    )
  })
})
