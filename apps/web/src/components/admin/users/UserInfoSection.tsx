interface UserInfoSectionProps {
	children?: React.ReactNode;
	title: string;
	subtitle?: string;
}

export default function UserInfoSection({
	children,
	title,
}: UserInfoSectionProps) {
	return (
		<div className="pb-16">
			<div className="flex items-center justify-start pb-10">
				<h2 className="text-3xl font-bold tracking-tight">{title}</h2>
				{/* <div className="ml-auto">
                <NavItemDialog />
            </div> */}
			</div>
			{children ? children : null}
		</div>
	);
}
