import React, { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
    paymentMethod: 'cod',
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) => (x.product === existItem.product ? item : x)),
                };
            } else {
                return { ...state, cartItems: [...state.cartItems, item] };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload),
            };
        case 'SAVE_SHIPPING_ADDRESS':
            return { ...state, shippingAddress: action.payload };
        case 'SAVE_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload };
        case 'CLEAR_CART':
            return { ...state, cartItems: [] };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    }, [state.shippingAddress]);

    const addToCart = (product, qty) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                product: product._id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                stock: product.stock,
                qty: Number(qty),
            },
        });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const saveShippingAddress = (data) => {
        dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data });
    };

    const savePaymentMethod = (data) => {
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: data });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
        localStorage.removeItem('cartItems');
    };

    // Calculations
    const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return (
        <CartContext.Provider
            value={{
                cart: state,
                addToCart,
                removeFromCart,
                saveShippingAddress,
                savePaymentMethod,
                clearCart,
                totals: { itemsPrice, shippingPrice, taxPrice, totalPrice },
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
