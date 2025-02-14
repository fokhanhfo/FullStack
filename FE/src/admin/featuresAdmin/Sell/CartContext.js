import { useSnackbar } from "notistack";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const{enqueueSnackbar } = useSnackbar();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const isExist = prevCart.some((item) => item.id === product.id);
  
      if (isExist) {
        enqueueSnackbar('Sản phẩm đã chọn',{variant: 'error'});
        return prevCart;
      }
      enqueueSnackbar('Thêm thành công',{variant: 'success'});
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
