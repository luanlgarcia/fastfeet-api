import { OrderDetails } from '@/domain/orders/enterprise/entities/value-objects/order-details'

export class OrderDetailsPresenter {
  static toHTTP(orderDetails: OrderDetails) {
    return {
      id: orderDetails.orderId.toString(),
      name: orderDetails.name,
      status: orderDetails.status,
      addressee: {
        id: orderDetails.addresseeId.toString(),
        name: orderDetails.addressee,
        street: orderDetails.street,
        number: orderDetails.number,
        city: orderDetails.city,
        state: orderDetails.state,
        postalCode: orderDetails.postalCode,
      },
      deliveryPersonId: orderDetails.deliveryPersonId?.toString() ?? null,
      deliveryPhotoId: orderDetails.deliveryPhotoId?.toString() ?? null,
      postedOn: orderDetails.postedOn,
      pickupDate: orderDetails.pickupDate,
      deliveryDate: orderDetails.deliveryDate,
      createdAt: orderDetails.createdAt,
      updatedAt: orderDetails.updatedAt,
    }
  }
}
