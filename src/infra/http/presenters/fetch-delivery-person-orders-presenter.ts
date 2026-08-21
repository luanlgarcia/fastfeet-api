import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'

export class FetchDeliveryPersonOrdersPresenter {
  static toHTTP(orderDetails: OrderDetails) {
    return {
      id: orderDetails.orderId.toString(),
      name: orderDetails.name,
      status: orderDetails.status,
      postedOn: orderDetails.postedOn,
      addressee: {
        id: orderDetails.addresseeId.toString(),
        name: orderDetails.addressee,
        street: orderDetails.street,
        number: orderDetails.number,
        city: orderDetails.city,
        state: orderDetails.state,
        postalCode: orderDetails.postalCode,
      },
    }
  }
}
