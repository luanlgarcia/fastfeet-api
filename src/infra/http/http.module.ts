import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/register-delivery-person'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateCrontroller } from './controllers/authenticate.controller'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/authenticate-delivery-person'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateCrontroller],
  providers: [RegisterDeliveryPersonUseCase, AuthenticateDeliveryPersonUseCase],
})
export class HttpModule {}
