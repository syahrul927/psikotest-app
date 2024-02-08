import { Skeleton } from "./skeleton";

const Text = ({
	str,
	isLoading,
}: {
	str: string | number;
	isLoading?: boolean;
}) => {
	return isLoading ? <Skeleton className="w-full h-4" /> : str;
};
export default Text;
