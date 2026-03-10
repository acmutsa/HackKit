import { Button, Html, Head, Body } from "@react-email/components";
import { type ComponentProps } from "react";

export default function Email() {
	return (
		<Html>
			<Head />
			<Body>
				<Button
					href="https://example.com"
					style={{
						background: "#000",
						color: "#fff",
						padding: "12px 20px",
					}}
				>
					Click me
				</Button>
			</Body>
		</Html>
	);
}

export type Test2EmailBody = ComponentProps<typeof Email>;
