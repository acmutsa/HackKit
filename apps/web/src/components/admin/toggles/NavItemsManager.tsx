"use client";

import type { NavItemToggleType } from "@/validators/shared/navitemtoggle";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAction, useOptimisticAction } from "next-safe-action/hooks";
import {
	setItem,
	removeItem,
	toggleItem,
} from "@/actions/admin/modify-nav-item";
import { toast } from "sonner";
import Link from "next/link";
import { Switch } from "@/components/shadcn/ui/switch";

interface NavItemsManagerProps {
	navItems: NavItemToggleType[];
}

export function NavItemsManager({ navItems }: NavItemsManagerProps) {
	const { execute, result, status } = useAction(removeItem, {
		onSuccess: () => {
			toast.success("NavItem deleted successfully!");
		},
	});

	return (
		<div className="pt-10">
			<Table>
				{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
				{/* TODO: FIX MASSIVE BUG WHERE IF ENCODED IS DIFFERENT IT WILL ALL BREAK */}
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Name</TableHead>
						<TableHead>Link</TableHead>
						<TableHead>Enabled</TableHead>
						<TableHead className="text-right">Options</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{navItems.map((item) => (
						<TableRow key={item.name}>
							<TableCell className="font-medium">
								{item.name}
							</TableCell>
							<TableCell>
								<Link className="underline" href={item.url}>
									{item.url}
								</Link>
							</TableCell>
							<TableCell>
								{/* <Switch
									checked={item.enabled}
									onCheckedChange={(checked) => didToggle(item.name, checked)}
								/> */}
								<ToggleSwitch
									itemStatus={item.enabled}
									name={item.name}
								/>
							</TableCell>
							<TableCell className="space-x-2 text-right">
								<Button onClick={() => alert("Coming soon...")}>
									Edit
								</Button>
								<Button
									onClick={() => {
										execute(item.name);
									}}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function ToggleSwitch({
	itemStatus,
	name,
}: {
	itemStatus: boolean;
	name: string;
}) {
	const initialData = { itemStatus }; // Initial data matching the shape of toggleItem's return type

	const { execute, optimisticData } = useOptimisticAction(
		toggleItem,
		initialData,
		(state, { statusToSet }) => {
			return { itemStatus: statusToSet };
		},
	);

	return (
		<Switch
			checked={optimisticData.itemStatus}
			onCheckedChange={(checked) =>
				execute({ name, statusToSet: checked })
			}
		/>
	);
}

export function NavItemDialog() {
	const [name, setName] = useState<string | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	const { execute, result, status } = useAction(setItem, {
		onSuccess: () => {
			console.log("Success");
			setOpen(false);
			toast.success("NavItem created successfully!");
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-1" />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>New Item</DialogTitle>
					<DialogDescription>
						Create a item to show in the non-dashboard navbar
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input
							onChange={(e) => setName(e.target.value)}
							id="name"
							placeholder="A Cool Hyperlink"
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							URL
						</Label>
						<Input
							onChange={(e) => setUrl(e.target.value)}
							id="name"
							placeholder="https://example.com/"
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={() => {
							console.log("Running Action");
							if (!name || !url)
								return alert("Please fill out all fields.");
							execute({ name, url });
						}}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
