import { toast } from '@zerodevx/svelte-toast'

const success = (m: string) => {
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--color-blue-600)',
			'--toastColor': 'white',
			'--toastBarBackground': 'rgba(33, 150, 243, 0.55)',
			'--toastBorderRadius': '6px'
		}
	})
}

const warning = (m: string) => {
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--color-orange-600)',
			'--toastColor': 'white',
			'--toastBarBackground': 'rgba(255, 152, 0, 0.55)',
			'--toastBorderRadius': '6px'
		}
	})
}

const error = (m: string) => {
	toast.push(m, {
		theme: {
			'--toastBackground': 'var(--color-pink-700)',
			'--toastColor': 'white',
			'--toastBarBackground': 'rgba(244, 67, 54, 0.55)',
			'--toastBorderRadius': '6px'
		}
	})
}

export const toasts = {
	success,
	warning,
	error
}
