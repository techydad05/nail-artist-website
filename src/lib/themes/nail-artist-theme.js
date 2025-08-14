export const nailArtistTheme = {
	name: 'nail-artist',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
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
		// surface | #1f2937 (dark gray)
		"--color-surface-50": "221 223 225", // #dddfe1
		"--color-surface-100": "210 212 215", // #d2d4d7
		"--color-surface-200": "199 202 205", // #c7cacd
		"--color-surface-300": "165 170 175", // #a5aaaf
		"--color-surface-400": "97 106 116", // #616a74
		"--color-surface-500": "31 41 55", // #1f2937
		"--color-surface-600": "28 37 50", // #1c2532
		"--color-surface-700": "23 31 41", // #171f29
		"--color-surface-800": "19 25 33", // #131921
		"--color-surface-900": "15 20 27", // #0f141b
	}
}