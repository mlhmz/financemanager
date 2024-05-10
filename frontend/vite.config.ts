import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import codegen from "vite-plugin-graphql-codegen";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			"/api/v1": {
				target: "http://localhost:8085",
			},
			"/api/graphql": {
				target: "http://localhost:8085",
			},
		},
	},
	plugins: [react(), codegen()],
});
