import React, { useEffect, useState } from "react";
import { getProduct } from "../../api/product";
import defaultImage from "../../assets/9.png";
import { createOrder, getDistricts, getProvinces, getWards } from "../../api/order";
import { useNavigate } from "react-router-dom";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
  const [products, setProducts] = useState([]); // Change to an array for multiple products
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payment, setPayment] = useState("PAY");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false); // State for Snackbar

  const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Function to fetch product details
  const fetchProduct = async () => {
    if (selectedProduct) {
      const data = await getProduct(selectedProduct.id);
      setProducts([data]); // Wrap in an array for consistency
    } else if (cart.length > 0) {
      // Fetch details for each product in the cart
      const productPromises = cart.map((item) => getProduct(item.productId));
      const productsData = await Promise.all(productPromises);
      setProducts(productsData);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await getProvinces();
      setProvinces(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    const response = await getDistricts(provinceId);
    setDistricts(response);
  };

  const fetchWards = async (districtId) => {
    const response = await getWards(districtId);
    setWards(response);
  };

  useEffect(() => {
    fetchProduct();
    fetchProvinces();
  }, []);

  const handlePlaceOrder = async () => {
    // Calculate total quantity and price based on cart and selected products
    const totalQuantity = cart.reduce((total, item, index) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item, index) => total + products[index].price * item.quantity, 0);
  
    // Prepare the order details based on products in the cart
    const orderDetails = cart.map((item, index) => ({
      product: { id: item.productId },
      price: products[index].price,
      qty: item.quantity,
    }));
  
    const orderData = {
      user: { id: user.id },
      product: cart.map((item) => ({ id: item.productId })),
      ward: { id: selectedWardId },
      type: "BUY",
      price: totalPrice,
      payment: payment,
      phone: phoneNumber,
      address: shippingAddress,
      orderDetails: orderDetails,
    };
  
    try {
      const response = await createOrder(orderData);
      if (response) {
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate("/orders");
        }, 1000);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };  

  const calculateTotalPrice = () => {
    if (selectedProduct) {
      return products[0] ? products[0].price * selectedProduct.quantity : 0;
    } else {
      return cart.reduce((total, item, index) => {
        const product = products[index];
        return product ? total + product.price * item.quantity : total;
      }, 0);
    }
  };

  return (
    <PayPalScriptProvider
      options={{ "client-id": "ARHEIQTdNml1kHsEMqGuRyBI2-To8dhPmKz0mRVEawilccHChB4OD6KKAAs4YV9iQ1BJNVKX0oWeAbKj" }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ flex: "2", background: "#fff" }}>
          <h1 style={{ textAlign: "center", color: "#333" }}>Checkout</h1>
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "20px" }}>
            <h3 style={{ marginBottom: "20px", color: "#333" }}>Billing and Shipping Information</h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={user.fullname}
                size="small"
                disabled
                inputProps={{ style: { height: "35px", fontSize: "14px" } }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={user.email}
                size="small"
                disabled
                inputProps={{ style: { height: "35px", fontSize: "14px" } }}
              />
              <TextField
                label="Shipping Address"
                variant="outlined"
                fullWidth
                value={shippingAddress}
                size="small"
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                inputProps={{ style: { height: "35px", fontSize: "14px" } }}
              />
              <FormControl fullWidth variant="outlined" sx={{ height: "50px", fontSize: "16px", padding: "8px 0" }}>
                <InputLabel>Province</InputLabel>
                <Select
                  value={selectedProvinceId || ""}
                  onChange={(e) => {
                    setSelectedProvinceId(e.target.value);
                    setDistricts([]);
                    setWards([]);
                    fetchDistricts(e.target.value);
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ height: "50px", fontSize: "16px", padding: "8px 0" }}>
                <InputLabel>District</InputLabel>
                <Select
                  value={selectedDistrictId || ""}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    setWards([]);
                    fetchWards(e.target.value);
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ height: "50px", fontSize: "16px", padding: "8px 0" }}>
                <InputLabel>Ward</InputLabel>
                <Select
                  value={selectedWardId || ""}
                  onChange={(e) => setSelectedWardId(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {wards.map((ward) => (
                    <MenuItem key={ward.id} value={ward.id}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                size="small"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                inputProps={{ style: { height: "35px", fontSize: "14px" } }}
              />
            </form>

            <div style={{ marginTop: "30px" }}>
              <h3 style={{ color: "#333" }}>Payment Method</h3>
              <RadioGroup value={payment} onChange={(e) => setPayment(e.target.value)}>
                <FormControlLabel value="PAY" control={<Radio />} label="PayPal" />
                <FormControlLabel value="CASH" control={<Radio />} label="Cash on Delivery" />
              </RadioGroup>
            </div>

            {payment === "PAY" && (
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: calculateTotalPrice(),
                          },
                          shipping: {
                            address: {
                              address_line_1: shippingAddress,
                              // Use `selectedProvinceId`, `selectedDistrictId`, `selectedWardId` to build full address
                              admin_area_1: provinces.find((p) => p.id === selectedProvinceId)?.name,
                              admin_area_2: districts.find((d) => d.id === selectedDistrictId)?.name,
                              locality: wards.find((w) => w.id === selectedWardId)?.name,
                              country_code: "VN", // Replace with the actual country code
                            },
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      // Now call the function to handle order after PayPal approval
                      handlePlaceOrder();
                    });
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <Button variant="contained" color="success" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        </div>

        <div style={{ flex: "1", background: "#f9f9f9", padding: "20px" }}>
          <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
          <div>
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={product.id} style={{ display: "flex", marginBottom: "15px" }}>
                  <img
                    src={product.images.length > 0 ? product.images[0] : defaultImage}
                    alt={product.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                  />
                  <div>
                    <h4>{product.name}</h4>
                    <p>Price: ${product.price}</p>
                    <p>Quantity: {selectedProduct ? selectedProduct.quantity : cart[index].quantity}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products in cart</p>
            )}
          </div>

          {/* Display Total Price */}
          <h4 style={{ textAlign: "right", marginTop: "20px" }}>Total: ${calculateTotalPrice()}</h4>
        </div>

        {/* Success Snackbar */}
        <Snackbar open={showSuccessToast} autoHideDuration={6000} onClose={() => setShowSuccessToast(false)}>
          <Alert onClose={() => setShowSuccessToast(false)} severity="success" sx={{ width: "100%" }}>
            Order placed successfully!
          </Alert>
        </Snackbar>
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
