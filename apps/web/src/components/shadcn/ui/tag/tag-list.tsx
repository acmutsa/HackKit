import { type Tag as TagType } from "./tag-input";
import type { FC, ReactNode } from "react";
import { Tag, TagProps } from "./tag";
import { cn } from "@/lib/utils/client/cn";

export type TagListProps = {
	tags: TagType[];
	customTagRenderer?: (tag: TagType) => ReactNode;
	direction?: TagProps["direction"];
} & Omit<TagProps, "tagObj">;

export const TagList: FC<TagListProps> = ({ tags, customTagRenderer, direction, ...tagProps }) => {
	return (
		<div
			className={cn("rounded-md max-w-[450px]", {
				"flex flex-wrap gap-2": direction === "row",
				"flex flex-col gap-2": direction === "column",
			})}
		>
			{tags.map((tagObj) =>
				customTagRenderer ? (
					customTagRenderer(tagObj)
				) : (
					<Tag key={tagObj.id} tagObj={tagObj} {...tagProps} />
				)
			)}
		</div>
	);
};
