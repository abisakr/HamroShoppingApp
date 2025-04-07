import { toast } from 'react-toastify';

const addToCart = async (e, id) => {
  e?.stopPropagation();
  e?.preventDefault();

  try {
    const response = await fetch("https://localhost:7223/api/Cart/createCart", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 this sends the JWT cookie
      body: JSON.stringify({ productId: id })
    });

    const responseData = await response.text();

    if (response.ok) {
      toast.success(responseData);
    } else {
      toast.error(responseData);
    }

    return responseData;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while adding to cart");
  }
};

export default addToCart;
