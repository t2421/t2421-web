import { defineConfig } from "@biomejs/biome";

export default defineConfig({
	// Using the latest schema
	$schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
	
	// Improved VCS configuration
	vcs: {
		enabled: true,
		clientKind: "git",
		useIgnoreFile: true,
	},
	
	// Improved file configuration
	files: {
		ignoreUnknown: true,
		ignore: [
			"**/node_modules/**",
			"**/dist/**",
			"**/.turbo/**",
			"**/coverage/**",
		],
	},
	
	// Formatting configuration
	formatter: {
		enabled: true,
		indentStyle: "tab",
	},
	
	// Import organization
	organizeImports: {
		enabled: true,
	},
	
	// Linting configuration 
	linter: {
		enabled: true,
		rules: {
			recommended: true,
		},
	},
	
	// JavaScript/TypeScript specific configuration
	javascript: {
		formatter: {
			quoteStyle: "double",
			semicolons: "asNeeded",
		},
	},
});