import { configureStore } from "@reduxjs/toolkit";
import conterReducer from '../features/Counter/counterSlice';
import useReducer from '../features/Auth/userSlice';
import actionsReducer from '../admin/reduxAdmin/slices/actionsSlice';
import { cartApi } from "features/Cart/cartApi";
import { categoryApiRedux } from "api/categoryApi";
import {productApi} from "admin/featuresAdmin/Produuct/hook/productApi"
const rootReducer ={
    actions : actionsReducer,
    count : conterReducer,
    user: useReducer,
    [cartApi.reducerPath]: cartApi.reducer, 
    [categoryApiRedux.reducerPath]: categoryApiRedux.reducer,
    [productApi.reducerPath]: productApi.reducer,
}

const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            cartApi.middleware,
            categoryApiRedux.middleware,
            productApi.middleware,
        ),
});

export default store;