interface FullScreenMessageProps {
	title?: string;
	message?: string;
}

export default function FullScreenMessage({
	message,
	title,
}: FullScreenMessageProps) {
	return (
		<div className="max-w-screen flex h-screen w-full flex-col items-center justify-center">
			{title && <h1 className="text-3xl font-black">{title}</h1>}
			{message && <p className="text-xl font-medium">{message}</p>}
		</div>
	);
}
