import { cn } from "@/lib/utils/client/cn";
import { BiLoaderCircle } from "react-icons/bi";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return <Loader2 className="animate-spin duration-1000 text-5xl" />;
}
