"use client";

import { CheckCircle, Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function KraeplinThanksPage() {
	return (
		<div className="bg-background flex min-h-screen items-center justify-center p-4">
			<div className="mx-auto w-full max-w-lg">
				<Card>
					<CardContent className="space-y-6 p-8 text-center">
						{/* Success Icon */}
						<div className="flex justify-center">
							<div className="bg-primary flex h-20 w-20 items-center justify-center rounded-full">
								<CheckCircle className="text-primary-foreground h-12 w-12" />
							</div>
						</div>

						{/* Main Message */}
						<div className="space-y-2">
							<h1 className="text-foreground text-2xl font-bold">Thank You!</h1>
							<p className="text-muted-foreground text-lg">
								Tes Anda berhasil dikirim
							</p>
						</div>

						{/* Status Card */}
						<Card className="bg-muted shadow-none">
							<CardContent className="space-y-3 p-4">
								<div className="flex items-center justify-center gap-2">
									<Clock className="h-5 w-5 text-orange-600" />
									<span className="text-sm font-medium">
										Menunggu Hasil Test
									</span>
								</div>
								<p className="text-muted-foreground text-sm">
									Kami sedang meninjau hasil tes Anda. Mohon tunggu sementara
									kami memproses hasilnya.
								</p>
							</CardContent>
						</Card>

						{/* Contact Information */}
						<div className="space-y-4">
							<h2 className="text-foreground text-lg font-semibold">
								Apa Selanjutnya?
							</h2>

							<div className="space-y-3 text-sm">
								<div className="flex items-start gap-3">
									<Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
									<div className="text-left">
										<p className="font-medium">Whatsapp</p>
										<p className="text-muted-foreground">
											Anda mungkin akan menerima panggilan lanjutan untuk
											informasi tambahan.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Expected Timeline */}
						<Card className="bg-muted shadow-none">
							<CardContent className="p-4">
								<p className="text-muted-foreground text-sm">
									<span className="font-medium">Estimasi:</span> 2-3 Hari Kerja
								</p>
							</CardContent>
						</Card>

						{/* Footer Note */}
						<p className="text-muted-foreground border-t pt-4 text-xs">
							Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi{" "}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
