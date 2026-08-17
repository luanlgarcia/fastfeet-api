import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/register-delivery-person'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateCrontroller } from './controllers/authenticate.controller'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/authenticate-delivery-person'
import { EditDeliveryPersonController } from './controllers/edit-delivery-person.controller'
import { EditDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/edit-delivery-person'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateCrontroller,
    EditDeliveryPersonController,
  ],
  providers: [
    RegisterDeliveryPersonUseCase,
    AuthenticateDeliveryPersonUseCase,
    EditDeliveryPersonUseCase,
  ],
})
export class HttpModule {}
