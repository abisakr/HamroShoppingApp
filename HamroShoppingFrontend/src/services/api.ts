const BASE_URL = "https://localhost:7223/api";

// Helper to get token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic Request Helper
async function request(url: string, options: RequestInit) {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeader(),
    },
  });

  // 1. Handle No Content (204)
  if (response.status === 204) return null;

  // 2. Get the response as text first
  const contentType = response.headers.get("content-type");
  const text = await response.text();

  let data;
  try {
    // 3. Try to parse as JSON
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    // 4. If it's not JSON, treat the text as the "result"
    data = { message: text };
  }

  // 5. If response is not OK, throw error using the message we found
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// --- AUTH SERVICES ---
export const authService = {
  adminLogin: (data: any) => request("/UserAccount/login/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
  userLogin: (data: any) => request("/UserAccount/login/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
  register: (data: any) => request("/UserAccount/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
  forgotPassword: (email: string) => request("/UserAccount/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }),
  getProfile: () => request("/UserAccount/profile", { 
    method: "POST" 
  }),
   editProfile: (data: { 
    fullName: string; 
    phoneNo: string; 
    address: string; 
    country: string; 
    city: string; 
  }) => request("/UserAccount/editProfile", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }),
};

// --- CATEGORY SERVICES ---
export const categoryService = {
  getAll: () => request("/Category/getAllCategory", { method: "GET" }),
  
  create: (formData: FormData) => request("/Category/createCategory", {
    method: "POST",
    body: formData, 
  }),

  delete: (id: number) => request(`/Category/deleteCategory/${id}`, { method: "DELETE" }),
  
  update: (id: number, formData: FormData) => request(`/Category/editCategory/${id}`, {
    method: "PUT",
    body: formData,
  }),
};

// --- PRODUCT SERVICES ---
export const productService = {
  getAll: () => request("/Product/getAllProducts", { method: "GET" }),
  getById: (id: number) => request(`/Product/getProductById/${id}`, { method: "GET" }),
  getByCategory: (catId: number) => request(`/Product/getProductByCategoryId/${catId}`, { method: "GET" }),
  
  create: (formData: FormData) => request("/Product/createProduct", {
    method: "POST",
    body: formData,
  }),
  
  delete: (id: number) => request(`/Product/deleteProduct/${id}`, { method: "DELETE" }),
  
  edit: (id: number, formData: FormData) => request(`/Product/editProduct/${id}`, {
    method: "PUT",
    body: formData,
  }),
   getPopular: () => request("/Product/getAllPopularProducts", { method: "GET" }),
  
  search: (name: string) => request(`/Product/getAllSearchedProducts?name=${name}`, { method: "GET" }),
  
  // order: 'a' for ascending (low to high), 'd' for descending (high to low)
  getFiltered: (categoryName: string = "", order: string = "") => 
    request(`/Product/getShortedFilteredProduct?categoryName=${categoryName}&order=${order}`, { method: "GET" }),
};

// --- CART SERVICES ---
export const cartService = {
  getAll: () => request("/Cart/getCartsByUserId", { method: "GET" }),
  addToCart: (productId: number) => request("/Cart/createCart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  }),
  updateQuantity: (id: number, quantity: number) => request(`/Cart/editCart/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  }),
  delete: (id: number) => request(`/Cart/deleteCart/${id}`, { method: "DELETE" }),
};

// --- ORDER SERVICES ---
export const orderService = {
  createCartOrder: (items: any[]) => request("/Order/createCartOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  }),
  getUserOrders: () => request("/Order/getOrdersByUserId", { method: "GET" }),

   getAllOrders: () => request("/Order/getAllOrder", { method: "GET" }),
  
    updateOrderStatus: (orderId: number, status: string) => request("/Order/editOrderStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: orderId, status: status }),
  }),

};

// --- RATING SERVICES ---
export const ratingService = {
  // Create a new rating
  create: (data: { productId: number; userRating: number; review: string }) => request("/Rating/createRating", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),

  // Update an existing rating by ID
  update: (id: number, data: { productId: number; userRating: number; review: string }) => request(`/Rating/editRating/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),

  // Delete a rating
  delete: (id: number) => request(`/Rating/deleteRating/${id}`, { 
    method: "DELETE" 
  }),

  // Get all ratings for a specific product
  getByProduct: (productId: number) => request(`/Rating/getRatingsByProductId/${productId}`, { 
    method: "GET" 
  }),

  // Get the specific rating left by the current logged-in user for a specific product
  getUserRatingForProduct: (productId: number) => request(`/Rating/getRatingByUserIdProductId/${productId}`, { 
    method: "GET" 
  }),
   getAiSummary: async (productId: number) => {
    // Note: Since the API expects just a number in the body, we pass it directly
    const response = await fetch(`https://localhost:7223/api/AI/aiReviewSummary`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productId)
    });
    return response.json();
  }
};