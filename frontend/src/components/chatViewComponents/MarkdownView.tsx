import { Box } from "@mui/material";
import { memo } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { CustomCode } from "./CustomCode";

type Props = {
	mdStr: string;
};

export const MarkdownView = memo(({ mdStr }: Props) => {
	return (
		<Box sx={{ w: "80%", mb: "1em" }}>
			<Markdown
				className="markdown-body"
				rehypePlugins={[rehypeRaw, rehypeSanitize]}
				remarkPlugins={[remarkGfm]}
				components={{
					code(props) {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const { node, ...rest } = props;
						const classAttr = rest.className;
						const value = rest.children;
						return <CustomCode classAttr={classAttr} value={value} />;
					},
				}}
			>
				{mdStr}
			</Markdown>
		</Box>
	);
});
