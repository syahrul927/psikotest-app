"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, Brain, MessageSquare, Target, ArrowLeft, BookOpen } from "lucide-react"
import { testData } from "@/lib/test-data"
import { useAllSubtest } from "@/hooks/api/ist-test/use-subtest"
import { useUpdateSession } from "@/hooks/api/ist-test/use-update-session"


export function IstSubtests({id}: {id: string} ) {
  const [completedSubtests, setCompletedSubtests] = useState<string[]>([])
  const{ data: subtestist }= useAllSubtest()
  const { mutate: updateStartSession } = useUpdateSession()

  const handleUpdateStartedTest = async(subtest: string) => {
    await updateStartSession({
      isInvitationId: id,
      subtest
    })
  }

  console.log("ini subtes",subtestist)

  // Map subtest types to more user-friendly descriptions and icons
  const getSubtestInfo = (id: string) => {
    // Convert id to number for comparison
    const numericId = parseInt(id)
    
    // Map specific ID ranges to types
    if (numericId >= 1 && numericId <= 3) {
      return {
        description: "Pilihan Ganda",
        icon: Target,
        category: "Kepribadian",
      }
    } else if (numericId === 4) {
      return {
        description: "Jawaban Teks",
        icon: MessageSquare,
        category: "Refleksi Diri",
      }
    } else if (numericId >= 5 && numericId <= 6) {
      return {
        description: "Pola Angka",
        icon: Brain,
        category: "Kemampuan Kognitif",
      }
    } else if (numericId === 9) {
      return {
        description: "Pilihan Ganda",
        icon: Target,
        category: "Kepribadian",
      }
    } else {
      return {
        description: "Subtes Umum",
        icon: Brain,
        category: "Umum",
      }
    }
  }

  const getSubtestDescription = (type: string) => {
    switch (type) {
      case "number-selection":
        return "Pilihlah kombinasi angka untuk menjawab pertanyaan yang ada."
      case "radio":
        return "Pilihlah jawaban yang menurut anda paling benar."
      case "checkbox":
        return "Temukan preferensi dan gaya kerja yang paling sesuai dengan diri Anda."
      case "text":
        return "Isilah jawaban didalam kolom yang telah disediakan."
      default:
        return "Selesaikan subtes ini untuk melengkapi penilaian psikologis Anda."
    }
  }

  const completionPercentage = Math.round((completedSubtests.length / testData.length) * 100)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pilih Subtes</h1>
            <p>Pilih subtes yang ingin Anda kerjakan</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border">
            <Target className="h-5 w-5 text-black" />
            <span className="font-medium text-black">3 Subtes Tersedia</span>
          </div>

          {completedSubtests.length > 0 && (
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full border">
              <CheckCircle2 className="h-5 w-5 text-black" />
              <span className="font-medium text-black">
                {completedSubtests.length} Diselesaikan ({completionPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {completedSubtests.length > 0 && (
          <div className="max-w-md mx-auto mb-12">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-black h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-black text-center">Progress Keseluruhan: {completionPercentage}%</p>
          </div>
        )}

        {/* Subtests Grid */}
        <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {subtestist?.map((subtest, type) => {
            const isCompleted = completedSubtests.includes(subtest.id)
            const subtestInfo = getSubtestInfo(subtest.id)
            const IconComponent = subtestInfo.icon

            return (
              <Card
                key={subtest.id}
                className={`
                  group relative overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300
                  ${isCompleted ? "ring-1 ring-gray-400 bg-gray-50" : ""}
                `}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-black text-white p-1.5 rounded-full">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4 relative">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <IconComponent className="h-6 w-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold leading-tight mb-1">{subtest.name}</CardTitle>
                      <div className="text-sm font-medium">{subtest.description}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-4 relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{subtest.timeLimit} menit</span>
                    <span className="">•</span>
                    <span className="text-sm font-medium">{subtest.questions.length} pertanyaan</span>
                  </div>
                  <p className="text-sm leading-relaxed">{getSubtestInfo(subtest.id).description}</p>
                </CardContent>

                <CardFooter className="pt-0 relative flex flex-col gap-2">
                  <Link href={`/guest/ist/${id}/subtest/test/${subtest.id}/training`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full font-medium transition-all duration-200 flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Latihan</span>
                    </Button>
                  </Link>
                  <Link href={`/guest/ist/${id}/subtest/test/${subtest.id}`} className="w-full">
                    <Button
                      onClick={() => handleUpdateStartedTest(subtest.id)}
                      variant={isCompleted ? "outline" : "default"}
                      className={`
                        w-full font-medium transition-all duration-200
                        ${isCompleted ? "hover:bg-gray-100" : "bg-black hover:bg-gray-800 text-white"}
                      `}
                    >
                      {isCompleted ? "Kerjakan Ulang" : "Mulai Subtes"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Completion Message */}
        {completedSubtests.length === testData.length && (
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl shadow-md">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-lg font-bold">Selamat! Anda telah menyelesaikan semua subtes!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
