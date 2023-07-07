interface AdminLayoutProps {
	children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<>
			<div className="w-screen h-16"></div>
			{children}
		</>
	);
}
