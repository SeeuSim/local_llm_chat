declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_VAR_ONE: string;
			VAR_ONE: string;
		}
	}
}

export {};
