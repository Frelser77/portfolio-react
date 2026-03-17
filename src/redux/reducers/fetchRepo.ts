import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Repo, ReposState } from "../../types";

export const fetchRepos = createAsyncThunk<Repo[], void, { rejectValue: string }>(
	"repos/fetchRepos",
	async (_, { rejectWithValue }) => {
		try {
			const response = await fetch("https://api.github.com/users/Frelser77/repos?per_page=100", {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
				},
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const repos: Repo[] = await response.json();
			return repos;
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
	},
);

const initialState: ReposState = {
	items: [],
	status: "idle",
	error: null,
};

export const repoSlice = createSlice({
	name: "repos",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepos.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchRepos.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchRepos.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Unknown error";
			});
	},
});

export default repoSlice.reducer;
