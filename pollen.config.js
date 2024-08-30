const fontStack = 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'

export default (pollen) => ({
	output: './src/styles/variables.css',
	modules: {
		color: {
			...pollen.color,
			white: '#fff',
			black: '#1b1b1b'
		},
		font: {
			...pollen.font,
			display: `"Fira Sans", ${fontStack}`,
			body: `"Fira Sans", ${fontStack}`,
			mono: `"Ubuntu Mono", ${fontStack}`
		},
		radius: {
			...pollen.radius,
			xl: '18px',
			xxl: '28px'
		}
	}
})
