-- AlterTable
ALTER TABLE "IstSubtestSession" ADD COLUMN     "subtest_9_image_remaining_time" INTEGER DEFAULT 180,
ADD COLUMN     "subtest_9_image_viewed_at" TIMESTAMPTZ(3);
