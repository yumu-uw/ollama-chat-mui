export type Chat = {
	role: string;
	content: string;
	images: string[];
};

export type RequestData = {
	model: string;
	messages: Chat[];
	stream: boolean;
};

export type ResponseData = {
	message: {
		content: string;
	};
};
