import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import repoReducer from "../reducers/fetchRepo";
import expireReducer from "redux-persist-expire"; // Importa expireReducer

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["repos"], // parti dello stato da persistere
	transforms: [
		// Aggiungi il transform per far scadere lo stato
		expireReducer("repos", {
			expireSeconds: 604800, // Imposta la scadenza su 1 settimana
			expiredState: {}, // Stato dopo la scadenza
			autoExpire: true, // Aggiorna automaticamente il timestamp di scadenza
		}),
	],
};

const rootReducer = combineReducers({
	repos: repoReducer,
});

// Applica Redux Persist al reducer principale
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [PERSIST], // FLUSH, REHYDRATE, PAUSE,PURGE, REGISTER
			},
		}),
});
// Crea il persistor che sarà utilizzato per controllare il processo di persistenza
const persistor = persistStore(store);

// Esporta sia lo store che il persistor
export { store, persistor };
