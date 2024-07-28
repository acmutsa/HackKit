interface FullScreenMessageProps {
	title?: string;
	message?: string;
}

export default function FullScreenMessage({ message, title }: FullScreenMessageProps) {
	return (
		<div className="w-full max-w-screen h-screen flex items-center justify-center flex-col">
			{title && <h1 className="text-3xl font-black">{title}</h1>}
			{message && <p className="text-xl font-medium">{message}</p>}
		</div>
	);
}
