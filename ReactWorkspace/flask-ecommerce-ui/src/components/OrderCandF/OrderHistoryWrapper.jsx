import { useParams } from "react-router-dom";
import OrderHistory from "./OrderHistory";

function OrderHistoryWrapper(props) {
    let params = useParams();

    return <OrderHistory params={params} />;
}

export default OrderHistoryWrapper;
