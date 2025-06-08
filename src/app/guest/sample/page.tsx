import { getImageKeyByValue, IMAGE_MAP } from "@/lib/image-map";

export default function QuestionsPage() {
  const image = "/images/questions/117.jpeg";
  const id = getImageKeyByValue(image);

  return (
    <div className="grid grid-cols-3 gap-4">
      <img
        key={id}
        src={`/api/images/${id}`}
        alt={`Question ${id}`}
        className="rounded shadow"
      />
    </div>
  );
}
