import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { AuthenticateAdminUseCase } from './authenticate-admin'

let inMemoryAdminRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateAdminUseCase

describe('Authenticate Admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateAdminUseCase(
      inMemoryAdminRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a admin', async () => {
    const admin = makeAdmin({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
  it('should not be able to authenticate a admin with the wrong password', async () => {
    const admin = makeAdmin({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '11111111111',
      password: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
  it('should not be able to authenticate a admin with the wrong cpf', async () => {
    const admin = makeAdmin({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '111111111111',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
