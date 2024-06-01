import { useParams, useNavigate } from "react-router-dom";
import PlaceOrderForm from "./PlaceOrderForm";

function PlaceOrderFormWrapper(props) {
    let params = useParams();
    let navigate = useNavigate();

    return <PlaceOrderForm params={params} navigate={navigate} onUpdateOrderList={props.onUpdateOrderList} />;
}

export default PlaceOrderFormWrapper;
