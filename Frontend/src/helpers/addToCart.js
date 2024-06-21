import { toast } from 'react-toastify'
import {jwtDecode} from "jwt-decode";

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()
    // const token = localStorage.getItem('token');
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : null;
    const jwtToken = parsedToken ? parsedToken.token : null;


    const decodedToken = jwtDecode(jwtToken); // Decode the token
    const userId = decodedToken.nameid;
    const response = await fetch("https://localhost:7223/api/Cart/createCart", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ userId, productId:id })
    });

    const responseData = await response.text()

    if(response.ok){
        toast.success(responseData)
    }

    if(responseData.error){
        toast.error(responseData.message)
    }


    return responseData

}


export default addToCart