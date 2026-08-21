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
import { PostOrderUseCase } from '@/domain/orders/application/use-cases/post-order'
import { PostOrderController } from './controllers/post-order.controller'
import { PickUpOrderController } from './controllers/pick-up-order.controller'
import { PickUpOrderUseCase } from '@/domain/orders/application/use-cases/pick-up-order'
import { DeliverOrderController } from './controllers/deliver-order.controller'
import { DeliverOrderUseCase } from '@/domain/orders/application/use-cases/deliver-order'
import { ReturnOrderController } from './controllers/return-order.controller'
import { ReturnOrderUseCase } from '@/domain/orders/application/use-cases/return-order'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { FetchNearbyOrdersUseCase } from '@/domain/orders/application/use-cases/fetch-nearby-orders'
import { EditPasswordAccountController } from './controllers/edit-password-account.controller'
import { EditPasswordDeliveryPersonUseCase } from '@/domain/orders/application/use-cases/edit-password-delivery-person'
import { FetchDeliveryPersonOrdersController } from './controllers/fetch-delivery-person-orders.controller'
import { FetchDeliveryPersonOrdersUseCase } from '@/domain/orders/application/use-cases/fetch-delivery-person-orders'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    FetchNearbyOrdersController,
    FetchDeliveryPersonOrdersController,
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
    PostOrderController,
    PickUpOrderController,
    DeliverOrderController,
    ReturnOrderController,
    EditPasswordAccountController,
  ],
  providers: [
    RegisterDeliveryPersonUseCase,
    FetchNearbyOrdersUseCase,
    FetchDeliveryPersonOrdersUseCase,
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
    PostOrderUseCase,
    PickUpOrderUseCase,
    DeliverOrderUseCase,
    ReturnOrderUseCase,
    EditPasswordDeliveryPersonUseCase,
  ],
})
export class HttpModule {}
