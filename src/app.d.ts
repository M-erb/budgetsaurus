// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errors?: Array[object]
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {
		// 	env?: {
		// 		db: D1Database
		// 	}
		// 	context: {
		// 		/* eslint-disable  @typescript-eslint/no-explicit-any */
		// 		waitUntil(promise: Promise<any>): void;
		// 	}
		// 	caches: CacheStorage & { default: Cache }
		// }
	}
}

export {}
