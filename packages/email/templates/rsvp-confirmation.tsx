import { Body, Container, Head, Html, Text } from "@react-email/components";
import * as React from "react";

interface ConfirmationEmailProps {
	name: string;
}

export default function RSVPConfirmationEmail({
	name,
}: ConfirmationEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Container style={container}>
					<Text style={text}>
						You have been successfully RSVPed to the event!
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
};

const text = {
	fontSize: "16px",
	lineHeight: "26px",
};
