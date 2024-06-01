import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

function ProductFormWrapper(props) {
    let params = useParams();
    let navigate = useNavigate();

    return <ProductForm params={params} navigate={navigate} onUpdateProductList={props.onUpdateProductList} />;
}

export default ProductFormWrapper;
