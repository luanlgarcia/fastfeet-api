import { HashComparer } from '@/domain/orders/application/cryptography/hash-comparer'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/orders/application/cryptography/hash-generator'
import { Encrypter } from '@/domain/orders/application/cryptography/encrypter'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
