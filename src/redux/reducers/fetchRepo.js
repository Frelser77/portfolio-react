import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Definizione della thunk action
export const fetchRepos = createAsyncThunk("repos/fetchRepos", async (_, { rejectWithValue }) => {
	try {
		const response = await fetch("https://api.github.com/users/Frelser77/repos?per_page=100", {
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
			},
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const repos = await response.json();
		return repos;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// Creazione dello slice
export const repoSlice = createSlice({
	name: "repos",
	initialState: {
		items: [],
		status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
		error: null,
	},
	reducers: {
		// Potenzialmente puoi inserire altri reducer qui per altre azioni sincrone
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepos.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchRepos.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Aggiungi qui il filtro se necessario o passa tutti i repo
				state.items = action.payload;
			})
			.addCase(fetchRepos.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

// Esporta il reducer generato automaticamente dallo slice
export default repoSlice.reducer;
