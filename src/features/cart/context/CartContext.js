import { createContext, useContext, useReducer } from "react"

const CartContextData = createContext()

const initState = {
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
}

const cartReducer = (state, action) => {
    console.log("actionData", action.products)
    switch (action.type) {
        case 'ADD_CART':
            localStorage.setItem("cart", JSON.stringify(action.products));
            return { ...state, cart: action.products }

        case 'update_qty':
            let cpyCart = [...state.cart]
            console.log("cpyData", cpyCart);
            let pIndex = cpyCart.findIndex(f => f.cart_id === `${action.Qty.id}-${action.Qty.w_id}`)
            if (pIndex > -1) {
                console.log("cpy", cpyCart[pIndex]);
                console.log("cpyall", { ...cpyCart[pIndex], qty: action.Qty.qty })

                cpyCart[pIndex] = { ...cpyCart[pIndex], qty: action.Qty.qty }
            }
            console.log("updateQty", action.Qty);
            localStorage.setItem("cart", JSON.stringify(cpyCart));
            return { ...state, cart: cpyCart }
        default:
            return { ...state }
    }
}

export const useCartContext = () => useContext(CartContextData);
export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initState);


    return < CartContextData.Provider value={{ state, dispatch }} >
        {children}
    </CartContextData.Provider >
}
