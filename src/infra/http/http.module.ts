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
import { GetAddresseeByIdController } from './controllers/get-addressee-by-id.controller'
import { GetAddresseeUseCase } from '@/domain/orders/application/use-cases/get-addressee-by-id'
import { EditAddresseeController } from './controllers/edit-addressee.controller'
import { EditAddresseeUseCase } from '@/domain/orders/application/use-cases/edit-addressee'
import { DeleteAddresseeController } from './controllers/delete-addressee.controller'
import { DeleteAddresseeUseCase } from '@/domain/orders/application/use-cases/delete-addressee'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/orders/application/use-cases/create-order'
import { GetOrderByIdController } from './controllers/get-order-by-id.controller'
import { GetOrderUseCase } from '@/domain/orders/application/use-cases/get-order-by-id'
import { EditOrderController } from './controllers/edit-order.controller'
import { EditOrderUseCase } from '@/domain/orders/application/use-cases/edit-order'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/orders/application/use-cases/delete-order'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateCrontroller,
    EditDeliveryPersonController,
    DeleteDeliveryPersonController,
    GetDeliveryPersonByIdController,
    CreateAddresseeController,
    GetAddresseeByIdController,
    EditAddresseeController,
    DeleteAddresseeController,
    CreateOrderController,
    GetOrderByIdController,
    EditOrderController,
    DeleteOrderController,
  ],
  providers: [
    RegisterDeliveryPersonUseCase,
    AuthenticateDeliveryPersonUseCase,
    EditDeliveryPersonUseCase,
    DeleteDeliveryPersonUseCase,
    GetDeliveryPersonUseCase,
    CreateAddresseeUseCase,
    GetAddresseeUseCase,
    EditAddresseeUseCase,
    DeleteAddresseeUseCase,
    CreateOrderUseCase,
    GetOrderUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
  ],
})
export class HttpModule {}
