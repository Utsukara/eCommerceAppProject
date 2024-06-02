import { useParams } from "react-router-dom";
import OrderDetails from "./OrderDetails";

function OrderDetailsWrapper(props) {
    let params = useParams();

    return <OrderDetails params={params} />;
}

export default OrderDetailsWrapper;
