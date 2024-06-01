import { useParams, useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm";

function CustomerFormWrapper(props) {
    let params = useParams();
    let navigate = useNavigate();

    return <CustomerForm params={params} navigate={navigate} onUpdateCustomerList={props.onUpdateCustomerList} />;
}

export default CustomerFormWrapper;
