import { IMAGE_MAP } from "@/lib/image-map";

export default function QuestionsPage() {
  const ids = Object.keys(IMAGE_MAP);

  return (
    <div className="grid grid-cols-3 gap-4">
      {ids.map((id) => (
        <img
          key={id}
          src={`/api/images/${id}`}
          alt={`Question ${id}`}
          className="rounded shadow"
        />
      ))}
    </div>
  );
}
