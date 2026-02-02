export const AnimationStage = {
  SHRINK: "shrink",
  FLY: "fly",
  FOLLOW: "follow",
} as const;
export type AnimationStageValues =
  (typeof AnimationStage)[keyof typeof AnimationStage];
