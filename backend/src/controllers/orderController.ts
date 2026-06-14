import { Request, Response } from 'express';
import prisma from '../prisma';
import { io } from '../app';
import { OrderStatus, Role } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { items, totalAmount, customerId: bodyCustomerId } = req.body;
  
  // Use body ID if auth is off, or try to get from user object
  let customerId = bodyCustomerId || req.user?.id;

  // Fallback for testing if no ID at all
  if (!customerId) {
    const firstUser = await prisma.user.findFirst({ where: { role: Role.CUSTOMER } });
    customerId = firstUser?.id;
  }

  if (!customerId) return res.status(401).json({ message: 'No customer ID found. Please seed the DB.' });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const order = await tx.order.create({
        data: {
          customerId,
          totalAmount,
          status: OrderStatus.PENDING,
          otp,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 2. Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            retailStock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    // 3. Broadcast to delivery boys
    io.to('delivery_boys').emit('new_order', result);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({ 
      include: { 
        items: { include: { product: true } }, 
        customer: true, 
        deliveryBoy: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

export const acceptOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { deliveryBoyId: bodyDeliveryBoyId } = req.body;
  
  let deliveryBoyId = bodyDeliveryBoyId || req.user?.id;

  // Fallback if no ID
  if (!deliveryBoyId) {
    const firstDelivery = await prisma.user.findFirst({ where: { role: Role.DELIVERY } });
    deliveryBoyId = firstDelivery?.id;
  }

  if (!deliveryBoyId) return res.status(400).json({ message: 'No delivery boy ID found.' });

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.status !== OrderStatus.PENDING) {
      return res.status(400).json({ message: 'Order not available' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        deliveryBoyId,
        status: OrderStatus.ACCEPTED,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept order', error });
  }
};

export const completeOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { otp } = req.body;

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.DELIVERED,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete order', error });
  }
};
