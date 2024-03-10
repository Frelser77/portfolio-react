import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import repoReducer from "../reducers/fetchRepo";

const rootReducer = combineReducers({
	repos: repoReducer,
});

const store = configureStore({
	reducer: rootReducer,
});

export default store;
