import axios from "axios";

export const signIn = async (credentials) => {
  const response = await axios.post("/api/users/signin", credentials);
  return response.data;
};
//Route signup user --------------------------------
export const signUp = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    formData.append(key, userData[key]);
  });

  const response = await axios.post("/api/users/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(formData);
  return response.data;
};
//Route signup seller --------------------------------
export const sellerSignup = async (userData) => {
  const formData = new FormData();
  Object.keys(userData).forEach((key) => {
    formData.append(key, userData[key]);
  });

  const response = await axios.post("/api/users/sellerSignup", formData);
  return response.data;
};

//Route logout --------------------------------
export const logout = async () => {
  const response = await axios.post("/api/users/logout", {
    withCredentials: true,
  });
  return response.data;
};

//Route authorization----------------------------------------------------------------
export const auth = async () => {
  const response = await axios.get("/api/check-auth", {
    withCredentials: true,
  });
  return response.data;
};
//Route authorization admin----------------------------------------------------------------
export const admin = async () => {
  const response = await axios.get("/api/check-admin", {
    withCredentials: true,
  });
  return response.data;
};
//Route authorization sellerOrAdmin----------------------------------------------------------------
export const sellerOrAdmin = async () => {
  const response = await axios.get("/api/check-selleOradmin", {
    withCredentials: true,
  });
  return response.data;
};
//Route forget password --------------------------------
export const forgetPassword = async (email) => {
  const response = await axios.post("/api/users/forget-password", email, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
//Route Reset Password----------------------------------------------------------------
export const resetPassword = async ({ password, token }) => {
  const response = await axios.post(
    "/api/users/reset-password",
    { password, token },
    {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  );

  return response.data;
};
// Route category-------------------------------------------------------------------------
export const maincategory = async (category) => {
  const response = await axios.get("/api/products/maincategories", {
    category,
  });
  return response.data;
};
//route product by id --------------------------------
export const findproduct = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
//Route Brand ------------------------------------------------------------
export const fetchbrand = async (category) => {
  const encodecategory = encodeURIComponent(category);
  console.log(encodecategory);
  const response = await axios.get(
    `/api/products/brand?mainCategory=${encodecategory}`
  );
  return response.data;
};
//Route canceled orders----------------------------
export const canceled = async (id) => {
  console.log(id);
  try {
    const response = await axios.post(`api/orders/${id}/cancel`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};



//Route get featured products --------------------------------

export const featuredproduct = async (page, limit) => {
  const response = await axios.get(
    `/api/products/featured?page=${page}&limit=${limit}`
  );

  return response.data;
};

//Route get deal products --------------------------------
export const getdeals = async (page, limit) => {
  const response = await axios.get(
    `/api/products/deal?page=${page}&limit=${limit}`
  );

  return response.data;
};
export const getdeal5stars = async (page, limit) => {
  const response = await axios.get(
    `/api/products/deal5stars?page=${page}&limit=${limit}`
  );
  return response.data;
};

//route shop with category --------------------------------
export const shop = async () => {
  const response = await axios.get("/api/products/maincategories");
  return response.data;
};

//route accessoires --------------------------------
export const accessoires = async (mainCategory, subCategory) => {
  const response = await axios.get(
    `/api/products/main/${mainCategory}/${subCategory}`
  );
  return response.data;
};

//Route search --------------------------------

export const search = async (query, page, limit) => {
  const url = decodeURIComponent(query).toLocaleLowerCase();

  const response = await axios.get(
    `/api/products/search?query=${url}&page=${page}&limit=${limit}`
  );
  return response.data;
};

//Route suggestions --------------------------------

export const suggestions = async (query) => {
  const response = await axios.get(`/api/products/suggest?query=${query}`);
  return response.data;
};

//Route post review --------------------------------
export const postReview = async ({ review, id }) => {
  const response = await axios.post(`/api/products/${id}/review`, review);
  return response.data;
};
//Route Similar Product --------------------------------

export const similarProduct = async (id) => {
  const response = await axios.get(`/api/products/${id}/similar`);
  return response.data;
};

//Route google api --------------------------------
export const google = async () => {
  const response = await axios.get("/api/config/google");
  return response.data;
};

//Route post placeOrder --------------------------------

export const placeOrder = async (orders) => {
  const response = await axios.post(`/api/orders/`, orders);
  return response.data;
};

////Route find order --------------------------------

export const findOrder = async (id) => {
  const response = await axios.get(`/api/orders/${id}`);
  return response.data;
};
//Route payment Floucy --------------------------------
export const initiatePayment = async ({ id, totalPrice }) => {
  const response = await axios.post(`/api/payment/${id}`, { totalPrice });
  return response.data;
};

//Route verify payment flouci --------------------------------
export const verifyPayment = async ({ id, payment_id }) => {
  const response = await axios.post(`/api/verify/${id}/${payment_id}`);
  return response.data;
};

//Route post cash payment --------------------------------

export const sendcashPayment = async (id) => {
  const response = await axios.post(`/api/orders/${id}/cashpay`);
  return response.data;
};

//Route cash payment --------------------------------
export const cashPayment = async (id) => {
  console.log(id);
  const response = await axios.get(`/api/orders/${id}/cashpay`);
  return response.data;
};
//Route Total order --------------------------------

export const totalOrder = async () => {
  const response = await axios.get(`/api/orders/totalOrders`);
  return response.data;
};

//Route count complete order  --------------------------------

export const Ordercomplete = async () => {
  const response = await axios.get(`/api/orders/completeOrder`);
  return response.data;
};

//Route view Orders --------------------------------
export const myOrder = async (page, limit) => {
  const response = await axios.get(
    `/api/orders/myOrder?page=${page}&limit=${limit}`
  );
  return response.data;
};

//Route view product                                 --------------------------------
export const viewProduct = async (id) => {
  const response = await axios.post(`/api/products/${id}/view`);
  return response.data;
};

//Route obtenir les informations de seller------------------------------------

export const sellerinfo = async () => {
  const response = await axios.get(`/api/users/seller`);
  return response.data;
};

//route total product of seller--------------------------------

export const totalProduct = async (page, limit) => {
  const response = await axios.get(
    `/api/products/seller?page=${page}&limit=${limit}`
  );
  return response.data;
};
//route total product of seller--------------------------------

export const sellerProduct = async (id , page, limit) => {
  const response = await axios.get(
    `/api/products/${id}/seller?page=${page}&limit=${limit}`
  );
  return response.data;
};


//route obtenir les orders de seller--------------------------------

export const sellerOrder = async (page, limit) => {
  const response = await axios.get(
    `/api/orders/seller?page=${page}&limit=${limit}`
  );
  return response.data;
};

//Route Admin view all order----------------------------
export const orders = async (page, limit) => {
  const response = await axios.get(
    `/api/orders/AllOrder?page=${page}&limit=${limit}`
  );

  return response.data;
};

//Route delete order--------------------------------

export const deleteOrder = async (id) => {
  console.log(id);
  const response = await axios.delete(`/api/orders/${id}`);
  return response.data;
};

// routes for Order update by admin------------------
export const updateOrder = async ({ id, updatedData }) => {
  const response = await axios.put(`/api/orders/${id}`, updatedData);
  return response.data;
};

//Route histoique ----------------------------------

export const historique = async (page, limit) => {
  const response = await axios.get(
    `/api/products/history?page=${page}&limit=${limit}`
  );
  return response.data;
};

//Route Admin get all users------------------------------

export const getUsers = async (page, limit) => {
  const response = await axios.get(`/api/users/?page=${page}&limit=${limit}`);
  return response.data;
};
//Route delete users-------------------------------------

export const deleteUser = async (id) => {
  const response = await axios.delete(`/api/users/${id}`);
  return response.data;
};

//Route Admin update user--------------------------------

export const updateUser = async ({ id, updatedData }) => {
  const response = await axios.put(`/api/users/${id}`, updatedData);
  return response.data;
};
//Route get user--------------------------------
export const getUser = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};
//Route user--------------------------------
export const fetchUser = async () => {
  const response = await axios.get(`/api/users/profile`);
  return response.data;
};

//Route admin get all products--------------------------------

export const getProducts = async (page, limit) => {
  const response = await axios.get(
    `/api/products/All?page=${page}&limit=${limit}`
  );
  return response.data;
};
//Route of summary information-----------------

export const fetchsummary = async () => {
  const response = await axios.get(`/api/orders/summary`);
  return response.data;
};


//Route promotion information----------------------------

export const promotion = async ({id , formData}) => {
  console.log(formData);
  const response = await axios.post(`/api/products/${id}/promotion` , formData);
  return response.data;
};

//seller delete Products--------------------------------

export const deleteProduct = async (id) => {
  const response = await axios.delete(`/api/products/${id}`);
  return response.data;
};

//Route Update Products-------------------------------
export const updateProduct = async ({ id, updatedData }) => {
  const formData = new FormData();

  // Append non-file fields
  Object.keys(updatedData).forEach((key) => {
    if (key !== "image") {
      // Exclude 'image' field
      formData.append(key, updatedData[key]);
    }
  });

  // Append image files
  if (updatedData.image && updatedData.image.length > 0) {
    updatedData.image.forEach((file) => {
      if (file instanceof File) {
        formData.append("image", file); // Append each file
      }
    });
  }

  const response = await axios.put(`/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

//Route create a new product----------------------------------

export const createProduct = async ({ productData }) => {
  const formData = new FormData();

  // Append non-file fields
  Object.keys(productData).forEach((key) => {
    if (key !== "image") {
      formData.append(key, productData[key]);
    }
  });
  console.log(formData);
  console.log(productData);

  // Append image files
  if (productData.image && productData.image.length > 0) {
    productData.image.forEach((file) => {
      if (file instanceof File) {
        formData.append("image", file); // Append each file
      }
    });
  }

  const response = await axios.post(`/api/products/new`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

//Route update profile----------------------------

export const updateProfile = async (formDataToSubmit) => {
  console.log({ formDataToSubmit });
  const response = await axios.put(`/api/users/profile`, formDataToSubmit, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
