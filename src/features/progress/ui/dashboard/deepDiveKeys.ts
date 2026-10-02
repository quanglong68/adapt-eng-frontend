import { DeepDiveRecommendation } from "../../../../entities/deepdive/deepDive.type";

export const getUniqueKey = (item: DeepDiveRecommendation) =>
  `${item.knowledgeItemId}_${item.targetWord || 'no_word'}`;
