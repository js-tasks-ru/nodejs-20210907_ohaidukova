import mapProduct from './product';

export default function mapOrder(order) {
  return {
    id: order.id,
    user: order.user,
    product: mapProduct(order.product),
    phone: order.phone,
    address: order.address,
  };
}
