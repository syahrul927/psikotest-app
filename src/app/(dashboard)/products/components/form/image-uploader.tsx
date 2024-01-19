import { useState } from "react";
import { Progress } from "../../../../_components/ui/progress";
import { Label } from "../../../../_components/ui/label";
import { UploadButton } from "~/lib/uploadthing-utils";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../../../../_components/ui/button";
import { useToast } from "../../../../_components/ui/use-toast";

interface ImageUploaderProps {
	appendImages: (image: { key: string; name: string; url: string }) => void;
}
const ImageUploader = ({ appendImages }: ImageUploaderProps) => {
	const [uploadingImage, setUploadingImage] = useState(false);
	const [progressUploadImage, setProgressUploadImage] = useState<number>(0);
	const { toast } = useToast();
	return (
		<>
			{uploadingImage ? (
				<div className="flex flex-col space-y-2">
					<Progress
						value={progressUploadImage}
						className="w-[40%] h-2 "
					/>
					<Label className="text-sm text-muted-foreground">
						Uploading {progressUploadImage}%
					</Label>
				</div>
			) : null}
			<UploadButton
				appearance={{
					container: "w-fit outline-none",
					allowedContent: cn(uploadingImage ? "hidden" : ""),
					button: cn(
						buttonVariants({ variant: "outline" }),
						"ut-uploading:cursor-not-allowed text-primary ut-button:after:ring-primary ut-button:text-primary ut-uploading:bg-transparent ut-uploading:text-primary ut-readying:bg-transparent after:bg-primary/80 ut-uploading:border-primary focus-within:ring-0",
						uploadingImage ? "hidden" : "",
					),
				}}
				endpoint="imageUploader"
				onBeforeUploadBegin={(files) => {
					setUploadingImage(true);
					return files;
				}}
				onClientUploadComplete={(res) => {
					appendImages({
						key: res[0]?.key ?? "",
						name: res[0]?.name ?? "",
						url: res[0]?.url ?? "",
					});
					toast({
						title: "Success Upload Images!",
					});
					setUploadingImage(false);
				}}
				onUploadProgress={(progress) => {
					setProgressUploadImage(progress);
				}}
				onUploadError={(error) => {
					setUploadingImage(false);
					setProgressUploadImage(0);
					toast({
						variant: "destructive",
						title: "Failed",
						description: error.message,
					});
				}}
			/>
		</>
	);
};
export default ImageUploader;
