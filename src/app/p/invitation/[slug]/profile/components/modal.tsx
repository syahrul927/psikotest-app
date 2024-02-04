import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/app/_components/ui/alert-dialog";

export function ModalConfirm({
	onConfirm,
	show = false,
}: {
	onConfirm: () => void;
	show?: boolean;
}) {
	return (
		<AlertDialog open={show}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah kamu sudah siap?</AlertDialogTitle>
					<AlertDialogDescription>
						Ketika kamu klik "Lanjut" kamu tidak dapat mengulang
						lagi dari awal!
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={onConfirm}>
						Lanjut
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
