import { toast } from 'react-toastify'
import {jwtDecode} from "jwt-decode";

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()
    // const token = localStorage.getItem('token');
    const jwtToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI4OWMwOGZmMC0zYWI1LTQ5MjktOTdhOC02ZWQ3NDQ1ODI4YWIiLCJuYW1lIjoiQWJpc2thciIsIm5iZiI6MTcxODczMDIxMCwiZXhwIjoxNzE4NzQxMDEwLCJpYXQiOjE3MTg3MzAyMTAsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.2_-TarxkYl4cfGOqIZ2fh2Ux1i0GDetFg8Kjz8fxy-O5knjJFkMhhei_ksgLYfd6aI4Za-gsadgEgVu0Vc_mJw"
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

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
    }


    return responseData

}


export default addToCart