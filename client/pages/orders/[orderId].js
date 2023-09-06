import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {

    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: (payment) => Router.push("/orders")
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId)
        }
    }, [order]);

    if (timeLeft < 0) {
        return <h1>Order Expired</h1>
    }

    return (
        <div>
            <div suppressHydrationWarning > Time left to pay: {timeLeft} seconds</div>
            {errors}
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51M6MwkDmaZvI6sluzZhel6UOEpZT8arIXppOL6nQsDvzSPJh8DCuu9iNbs9IcLU0I5hfc5mHfUlPJhY5v6xo9Ihi002I88vGlo"
                amount={order.ticket.price * 100}
                email={currentUser.email} />
        </div>
    )
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data }
}

export default OrderShow;