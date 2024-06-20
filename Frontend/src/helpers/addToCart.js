import { toast } from 'react-toastify'
import {jwtDecode} from "jwt-decode";

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()
    // const token = localStorage.getItem('token');
    const jwtToken ="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI4OWMwOGZmMC0zYWI1LTQ5MjktOTdhOC02ZWQ3NDQ1ODI4YWIiLCJuYW1lIjoiQWJpc2thciIsIm5iZiI6MTcxODg5MTc0OSwiZXhwIjoxNzE4OTAyNTQ5LCJpYXQiOjE3MTg4OTE3NDksImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.hWIsRnow1Fp9lvxt3HhkUd_t49rRDt1N8PbMC1pvOgNMHmyeoaRHmk0qLk8Gf8qa6cxGPl70K-wZlbOip5w9pA"


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
        alert("added to cart")
        console.console.log("added to cart");
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
    }


    return responseData

}


export default addToCart