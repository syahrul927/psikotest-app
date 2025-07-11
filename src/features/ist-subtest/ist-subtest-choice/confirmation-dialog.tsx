"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Play } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const defaultInstruction = `
## PETUNJUK DAN CONTOH 

Soal-soal terdiri atas kalimat-kalimat.
Pada setiap kalimat satu kata hilang dan disediakan 5 (lima) kata pilihan sebagai penggantinya. Pilihan kata yang tepat dapat menyempurnakan kalimat itu!

**Contoh**
Seekor kuda mempunyai kesamaan terbanyak dengan seekor ....

A) kucing
B) bajing
C) keledai
D) lembu
E) anjing

Jawaban yang benar ialah : C) keledai

Oleh karena itu, pada lembar jawaban di belakang contoh, huruf C harus dicoret.

A B **~~C~~** D E

**Contoh berikutnya :**

Lawannya "harapan" ialah .....

A) duka
B) putus asa
C) sengsara
D) cinta
E) benci

Jawabannya ialah B) putus asa

Maka huruf B yang seharusnya dicoret.
`;

export interface ConfirmationDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  instruction?: string | null;
  informationData: {
    name: string;
    description: string;
    duration: number;
    totalQuestion: number;
  };
  onConfirm: () => void;
}

const ConfirmationDialog = React.forwardRef<
  HTMLDivElement,
  ConfirmationDialogProps
>(
  (
    { instruction = defaultInstruction, informationData, onConfirm, children },
    ref,
  ) => {
    const title = `Konfirmasi Memulai Subtes: ${informationData.name} (${informationData.description})`;
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent
          ref={ref}
          className={
            "max-h-[80dvh] max-w-lg overflow-scroll md:max-w-xl lg:max-w-7xl"
          }
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {/* Information Section */}
                <div className="bg-muted/50 rounded-lg border p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h4 className="mb-2 font-semibold">Information:</h4>
                    <ul className="space-y-1">
                      <li>
                        <strong>Nama:</strong> {informationData.name}
                      </li>
                      <li>
                        <strong>Deskripsi:</strong>{" "}
                        {informationData.description}
                      </li>
                      <li>
                        <strong>Durasi:</strong> {informationData.duration}
                      </li>
                      <li>
                        <strong>Total Pertanyaan:</strong>{" "}
                        {informationData.totalQuestion}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Custom Instruction Section with Markdown */}
                {instruction && (
                  <div className="rounded-lg border bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                    <article className="prose prose-sm dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          img: ({ node, ...props }) => (
                            <img
                              {...props}
                              style={{
                                mixBlendMode: "multiply",
                                backgroundColor: "transparent",
                                maxWidth: "100%",
                              }}
                            />
                          ),
                        }}
                      >
                        {instruction}
                      </ReactMarkdown>
                    </article>
                  </div>
                )}

                {/* Warning Section */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h4 className="mb-2 font-semibold">Perhatian Penting:</h4>
                    <ul className="space-y-1">
                      <li>Setelah memulai, timer akan berjalan otomatis</li>
                      <li>Pastikan koneksi internet stabil</li>
                      <li>Jangan menutup atau refresh halaman selama tes</li>
                      <li>Subtes yang sudah dimulai tidak dapat diulang</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => onConfirm()}>
              <Play className="mr-2 h-4 w-4" /> Mulai Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ConfirmationDialog.displayName = "ConfirmationDialog";

export default ConfirmationDialog;
