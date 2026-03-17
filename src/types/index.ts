// Shared TypeScript types for the portfolio

export interface Repo {
	id: number;
	name: string;
	description: string | null;
	html_url: string;
	created_at: string;
	pushed_at: string;
	language: string | null;
	stargazers_count: number;
	fork: boolean;
}

export interface ReposState {
	items: Repo[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

export interface DarkModeContextType {
	darkMode: boolean;
	toggleDarkMode: () => void;
}

export interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
	life: number;
	burst: boolean;
}
