import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/register-delivery-person'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateCrontroller } from './controllers/authenticate.controller'
import { AuthenticateDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/authenticate-delivery-person'
import { EditDeliveryPersonController } from './controllers/edit-delivery-person.controller'
import { EditDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/edit-delivery-person'
import { DeleteDeliveryPersonController } from './controllers/delete-delivery-person.controller'
import { DeleteDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/delete-delivery-person'
import { GetDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/get-delivery-person-by-id'
import { GetDeliveryPersonByIdController } from './controllers/get-delivery-person-by-id.controller'
import { CreateAddresseeController } from './controllers/create-addressee.controller'
import { CreateAddresseeUseCase } from '@/domain/orders/application/use-cases/create-addressee'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateCrontroller,
    EditDeliveryPersonController,
    DeleteDeliveryPersonController,
    GetDeliveryPersonByIdController,
    CreateAddresseeController,
  ],
  providers: [
    RegisterDeliveryPersonUseCase,
    AuthenticateDeliveryPersonUseCase,
    EditDeliveryPersonUseCase,
    DeleteDeliveryPersonUseCase,
    GetDeliveryPersonUseCase,
    CreateAddresseeUseCase,
  ],
})
export class HttpModule {}
