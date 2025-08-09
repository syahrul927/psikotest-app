"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCheckSubtest9Access } from "@/hooks/api/ist-test/use-check-subtest9-access";
import { useMarkSubtest9Image } from "@/hooks/api/ist-test/use-mark-subtest9-image";
import { ClockAlert, Eye, Play } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  InteractiveExampleDataSchema,
  type InteractiveExampleData,
} from "../types/interactive-instruction";
import { InteractiveExample } from "./interactive-example";
import { VideoPlaylist } from "./video-playlist";

export interface VideoData {
  id: string;
  title: string;
  url: string;
  duration?: number; // in seconds
  thumbnail?: string;
}

export interface ConfirmationDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  subtestType: string;
  instruction?: string | null;
  informationData: {
    name: string;
    description: string;
    duration: number;
    totalQuestion: number;
  };
  videos?: string[]; // Array of video URLs from database
  onConfirm: () => void;
  istInvitationId?: string; // NEW: For tracking subtest 9 image access
}

const ConfirmationDialog = React.forwardRef<
  HTMLDivElement,
  ConfirmationDialogProps
>(
  (
    {
      instruction = `No instruction available for this subtest`,
      informationData,
      videos,
      subtestType,
      onConfirm,
      istInvitationId,
      children,
    },
    ref,
  ) => {
    const [isMemorizing, setIsMemorizing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const [hasViewedImage, setHasViewedImage] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Convert video URLs from database to VideoData format
    const videosFromDb = videos || [];
    const formattedVideos: VideoData[] = videosFromDb.map((url, index) => ({
      id: `video-${index + 1}`,
      title: `Video ${index + 1}`,
      url: url,
    }));
    const title = `Konfirmasi Memulai Subtes: ${informationData.name} (${informationData.description})`;

    // Clean up timer on unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, []);

    // Check image access status for subtest 9
    const { data: imageAccessData, isLoading: isCheckingAccess } =
      useCheckSubtest9Access(istInvitationId || "", subtestType);

    useEffect(() => {
      if (imageAccessData) {
        setHasViewedImage(imageAccessData.viewed);
      }
    }, [imageAccessData]);

    // Mark image viewed mutation
    const markImageViewedMutation = useMarkSubtest9Image(
      (data) => {
        setHasViewedImage(data.viewed);
        // Only start timer if this is the first time marking
        if (!data.alreadyMarked && data.success) {
          startInternalTimer();
        }
      },
      () => {
        // Fallback: set as viewed to prevent retry
        setHasViewedImage(true);
      },
    );

    const startInternalTimer = () => {
      setIsMemorizing(true);
      setTimeLeft(180);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setIsMemorizing(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    };

    const startMemorization = async () => {
      if (
        isMemorizing ||
        hasViewedImage ||
        !istInvitationId ||
        subtestType !== "9"
      )
        return;

      markImageViewedMutation.mutate({
        istInvitationId: istInvitationId,
        subtestId: subtestType,
      });
    };

    // Close memorization view (when timer ends or user closes)
    const closeMemorization = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsMemorizing(false);
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const stopMemorization = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onConfirm();
    };
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent
          ref={ref}
          className={
            "max-h-[100dvh] max-w-xl overflow-scroll md:max-h-[90dvh] md:max-w-xl lg:max-w-7xl"
          }
        >
          <>
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              {/* Information Section */}
              <div className="bg-muted/50 rounded-lg border p-4 text-left">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h4 className="mb-2 font-semibold">Information:</h4>
                  <ul className="space-y-1">
                    <li>
                      <strong>Nama:</strong> {informationData.name}
                    </li>
                    <li>
                      <strong>Deskripsi:</strong> {informationData.description}
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

              {/* Video Section */}
              {formattedVideos.length > 0 && (
                <div className="rounded-lg border bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-left">
                    <h4 className="mb-3 font-semibold">Video Panduan:</h4>
                    <VideoPlaylist videos={formattedVideos} />
                  </div>
                </div>
              )}

              {/* Custom Instruction Section with Markdown */}
              {instruction && (
                <div className="rounded-lg border bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                  <article className="prose prose-pre:bg-transparent prose-pre:p-0 prose-sm dark:prose-invert text-left">
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
                        code: ({ node, className, children, ...props }) => {
                          if (className === "language-json-interactive") {
                            try {
                              const data = InteractiveExampleDataSchema.parse(
                                JSON.parse(children as string),
                              );
                              return <InteractiveExample data={data} />;
                            } catch (error) {
                              console.warn(
                                "Failed to parse interactive JSON:",
                                error,
                              );
                              return (
                                <code {...props} className={className}>
                                  {children}
                                </code>
                              );
                            }
                          }
                          return (
                            <code {...props} className={className}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {instruction}
                    </ReactMarkdown>
                  </article>
                </div>
              )}

              {/* Special instruction and image button for subtest 9 */}
              {subtestType === "9" && (
                <div className="space-y-3">
                  {isCheckingAccess && (
                    <div className="text-muted-foreground text-sm">
                      Memeriksa status gambar...
                    </div>
                  )}
                  {markImageViewedMutation.isPending && (
                    <div className="text-muted-foreground text-sm">
                      Mencatat akses gambar...
                    </div>
                  )}
                  {!isCheckingAccess && !markImageViewedMutation.isPending && (
                    <>
                      {!hasViewedImage && (
                        <Button
                          variant="secondary"
                          onClick={startMemorization}
                          disabled={isMemorizing}
                        >
                          <Eye />
                          {isMemorizing
                            ? `Lihat gambar (tersisa ${formatTime(timeLeft)})`
                            : "Lihat gambar untuk dihafal"}
                        </Button>
                      )}
                      {hasViewedImage && (
                        <span className="text-muted-foreground inline-flex align-middle text-sm">
                          <ClockAlert className="mr-2" size={16} />
                          Gambar sudah pernah dilihat - tidak dapat melihat
                          kembali
                        </span>
                      )}
                    </>
                  )}

                  {isMemorizing && subtestType === "9" && (
                    <div className="border-t pt-3">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-center">
                          <span
                            className={`text-sm font-medium ${timeLeft <= 30 ? "text-red-500" : "text-blue-500"}`}
                          >
                            {formatTime(timeLeft)} tersisa
                          </span>
                        </div>

                        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-lg border shadow-sm">
                          <Image
                            src="/images/instruction/9.jpeg"
                            fill
                            alt="Gambar untuk dihafal"
                            className="object-contain dark:invert"
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeMemorization}
                          className="text-muted-foreground hover:text-foreground text-xs"
                        >
                          Tutup gambar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Warning Section */}
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
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => onConfirm()}>
                <Play className="mr-2 h-4 w-4" /> Mulai Test
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ConfirmationDialog.displayName = "ConfirmationDialog";

export default ConfirmationDialog;
