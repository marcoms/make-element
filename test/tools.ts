let customElId = 0;

export function customElName() {
	++customElId;
	return `x-${customElId}`;
}

declare global {
	interface Window {
		ShadowRoot: any;
	}
}
