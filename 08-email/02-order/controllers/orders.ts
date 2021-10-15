import Order from '../models/Order';
import User from '../models/User';
import { sendMail, IMailOptions } from '../libs/sendMail';
import mapOrder from '../mappers/order';

export const checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  const order = new Order({
    product,
    phone,
    address,
    user: ctx.user,
  });

  await order.save();

  const options: IMailOptions = {
    template: 'order-confirmation',
    locals: { id: order._id, product: order.product },
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
  };

  await sendMail(options);

  ctx.body = { order: order._id };
};

export const getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({ user: ctx.user }).populate('product');
  ctx.body = { orders: orders.map(mapOrder) };
};
