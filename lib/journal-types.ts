export type FeelingTone =
  | "서운함"
  | "실망"
  | "불안"
  | "화남"
  | "외로움"
  | "답답함"
  | "혼란"
  | "슬픔";

export type NeedType = "사과" | "공감" | "해결" | "행동" | "시간" | "휴식";

export type ReflectionChoice = "예" | "아니오" | "잘 모르겠음";

export type RelationshipEntry = {
  id: string;
  createdAt: string;
  date: string;
  activity: string;
  laughedTogether: ReflectionChoice;
  feltComfortable: ReflectionChoice;
  feltConsidered: ReflectionChoice;
  feltAuthentic: ReflectionChoice;
  wishToMeetAgain: string;
  memo: string;
};

export type HealingEntry = {
  id: string;
  createdAt: string;
  date: string;
  event: string;
  feelings: FeelingTone[];
  interpretedMeaning: string;
  otherPossibilities: string;
  emotionOrValue: "감정" | "가치관" | "둘 다" | "아직 모르겠음";
  wanted: NeedType[];
  timing: "지금 말하기" | "3일 뒤 다시 보기";
  privateRelease: string;
  revisitDate: string;
  revisitSameFeeling?: "같음" | "약해짐" | "달라짐" | "아직 모르겠음";
  revisitMemo?: string;
};

export type MarriageTopic =
  | "돈 관리"
  | "직업과 커리어"
  | "부모님과 원가족"
  | "형제자매 문제"
  | "자녀 계획"
  | "주거 계획"
  | "갈등 해결 방식"
  | "서로의 역할"
  | "우리가 만들고 싶은 가정";

export type MarriageNote = {
  id: string;
  createdAt: string;
  date: string;
  topic: MarriageTopic;
  notes: string;
  gentleNextStep: string;
};

export type JournalData = {
  relationshipEntries: RelationshipEntry[];
  healingEntries: HealingEntry[];
  marriageNotes: MarriageNote[];
};
