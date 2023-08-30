import { NotAuthorizedError, NotFoundError, requireAuth } from "@singtickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.put("/api/orders/:orderId", [
    body('orderId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided'),
], requireAuth, async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publishing an event for order Cancelled

    res.status(204).send(order);
})

export { router as deleteOrderRouter }