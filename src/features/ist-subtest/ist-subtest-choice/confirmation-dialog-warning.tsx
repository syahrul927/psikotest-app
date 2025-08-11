export const ConfirmationDialogWarning = () => {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="prose prose-sm dark:prose-invert max-w-none text-left">
        <h4 className="mb-2 font-semibold">Perhatian Penting:</h4>
        <ul className="space-y-1">
          <li>Setelah memulai, timer akan berjalan otomatis</li>
          <li>Pastikan koneksi internet stabil</li>
          <li>Jangan menutup atau refresh halaman selama tes</li>
          <li>Subtes yang sudah dimulai tidak dapat diulang</li>
        </ul>
      </div>
    </div>
  );
};