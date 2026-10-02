import { DeepDiveRecommendation } from "../../../../entities/deepdive/deepDive.type";

export function KnowledgeBadge({ item }: { item: DeepDiveRecommendation }) {
  if (item.targetWord) {
    return (
      <span><span className="text-indigo-700 font-semibold px-1.5 py-0.5 rounded mr-2 text-[11px] uppercase bg-indigo-50 border border-indigo-200">Từ vựng</span>{item.targetWord}</span>
    );
  }
  return (
    <span><span className="text-purple-700 font-semibold px-1.5 py-0.5 rounded mr-2 text-[11px] uppercase bg-purple-50 border border-purple-200">Ngữ pháp</span>{item.knowledgeName}</span>
  );
}
