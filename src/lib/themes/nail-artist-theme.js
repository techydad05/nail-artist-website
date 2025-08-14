export const nailArtistTheme = {
	name: 'nail-artist',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "15 23 42",
		"--theme-font-color-dark": "248 250 252",
		"--theme-rounded-base": "6px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "15 23 42",
		// =~= Theme Colors  =~=
		// primary | #8b5cf6 (vibrant purple)
		"--color-primary-50": "238 231 254", // #eee7fe
		"--color-primary-100": "232 222 253", // #e8defd
		"--color-primary-200": "227 214 253", // #e3d6fd
		"--color-primary-300": "210 190 251", // #d2befb
		"--color-primary-400": "176 141 248", // #b08df8
		"--color-primary-500": "139 92 246", // #8b5cf6
		"--color-primary-600": "125 83 221", // #7d53dd
		"--color-primary-700": "104 69 185", // #6845b9
		"--color-primary-800": "83 55 148", // #533794
		"--color-primary-900": "68 45 121", // #442d79
		// secondary | #ec4899 (hot pink)
		"--color-secondary-50": "252 228 240", // #fce4f0
		"--color-secondary-100": "251 218 235", // #fbdaeb
		"--color-secondary-200": "250 209 230", // #fad1e6
		"--color-secondary-300": "247 182 215", // #f7b6d7
		"--color-secondary-400": "240 127 184", // #f07fb8
		"--color-secondary-500": "236 72 153", // #ec4899
		"--color-secondary-600": "212 65 138", // #d4418a
		"--color-secondary-700": "177 54 115", // #b13673
		"--color-secondary-800": "142 43 92", // #8e2b5c
		"--color-secondary-900": "116 35 75", // #74234b
		// tertiary | #06b6d4 (cyan)
		"--color-tertiary-50": "218 244 249", // #daf4f9
		"--color-tertiary-100": "205 240 246", // #cdf0f6
		"--color-tertiary-200": "193 237 244", // #c1edf4
		"--color-tertiary-300": "155 226 238", // #9be2ee
		"--color-tertiary-400": "80 204 225", // #50cce1
		"--color-tertiary-500": "6 182 212", // #06b6d4
		"--color-tertiary-600": "5 164 191", // #05a4bf
		"--color-tertiary-700": "5 137 159", // #05899f
		"--color-tertiary-800": "4 109 127", // #046d7f
		"--color-tertiary-900": "3 89 104", // #035968
		// success | #10b981
		"--color-success-50": "219 245 236", // #dbf5ec
		"--color-success-100": "207 241 230", // #cff1e6
		"--color-success-200": "195 238 224", // #c3eee0
		"--color-success-300": "159 227 205", // #9fe3cd
		"--color-success-400": "88 206 167", // #58cea7
		"--color-success-500": "16 185 129", // #10b981
		"--color-success-600": "14 167 116", // #0ea774
		"--color-success-700": "12 139 97", // #0c8b61
		"--color-success-800": "10 111 77", // #0a6f4d
		"--color-success-900": "8 91 63", // #085b3f
		// warning | #f59e0b
		"--color-warning-50": "254 240 218", // #fef0da
		"--color-warning-100": "253 236 206", // #fdecce
		"--color-warning-200": "253 231 193", // #fde7c1
		"--color-warning-300": "251 216 156", // #fbd89c
		"--color-warning-400": "248 187 82", // #f8bb52
		"--color-warning-500": "245 158 11", // #f59e0b
		"--color-warning-600": "221 142 10", // #dd8e0a
		"--color-warning-700": "184 119 8", // #b87708
		"--color-warning-800": "147 95 7", // #935f07
		"--color-warning-900": "120 77 5", // #784d05
		// error | #ef4444
		"--color-error-50": "253 227 227", // #fde3e3
		"--color-error-100": "252 218 218", // #fcdada
		"--color-error-200": "251 208 208", // #fbd0d0
		"--color-error-300": "249 180 180", // #f9b4b4
		"--color-error-400": "244 124 124", // #f47c7c
		"--color-error-500": "239 68 68", // #ef4444
		"--color-error-600": "215 61 61", // #d73d3d
		"--color-error-700": "179 51 51", // #b33333
		"--color-error-800": "143 41 41", // #8f2929
		"--color-error-900": "117 33 33", // #752121
		// surface | Modern neutral palette
		"--color-surface-50": "248 250 252", // #f8fafc - very light
		"--color-surface-100": "241 245 249", // #f1f5f9 - light
		"--color-surface-200": "226 232 240", // #e2e8f0 - light gray
		"--color-surface-300": "203 213 225", // #cbd5e1 - medium light
		"--color-surface-400": "148 163 184", // #94a3b8 - medium
		"--color-surface-500": "100 116 139", // #64748b - medium dark
		"--color-surface-600": "71 85 105", // #475569 - dark
		"--color-surface-700": "51 65 85", // #334155 - darker
		"--color-surface-800": "30 41 59", // #1e293b - very dark
		"--color-surface-900": "15 23 42", // #0f172a - darkest
	}
}