export const deepCopyObject = <T>(obj: T): T => {
	return JSON.parse(JSON.stringify(obj));
};
