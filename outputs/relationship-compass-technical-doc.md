# Relationship Compass 기술 문서

## 1. 프로젝트 개요

Relationship Compass는 Next.js 기반의 개인용 Relationship Journal 웹앱이다. 초기 MVP는 외부 로그인이나 서버 저장소 없이 브라우저 로컬스토리지를 사용하며, 사용자가 관계 속 경험과 감정을 안전하게 기록하고 다시 돌아볼 수 있도록 설계되었다.

이 앱은 상대를 평가하거나 점수화하는 도구가 아니다. 코드와 UI 모두에서 총점, 합격/불합격, 추천/탈락, 결혼 여부 판단 같은 구조를 의도적으로 배제한다.

## 2. 기술 스택

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI approach: shadcn/ui의 단순하고 접근성 있는 컴포넌트 스타일을 참고한 로컬 UI 컴포넌트
- Icons: lucide-react
- State persistence: localStorage
- Package manager: npm

## 3. 실행 방법

```bash
npm install
npm run dev
```

현재 개발 서버는 기본 포트 `3000`이 사용 중이면 Next.js가 자동으로 다른 포트를 선택한다. 마지막 확인 시 앱은 아래 주소에서 실행되었다.

```text
http://localhost:3001
```

프로덕션 빌드 확인:

```bash
npm run build
```

빌드 검증 결과:

```text
next build 성공
```

## 4. 폴더 구조

```text
app/
  globals.css
  layout.tsx
  page.tsx

components/
  relationship-compass-app.tsx
  ui.tsx

lib/
  journal-store.ts
  journal-types.ts
  utils.ts

outputs/
  relationship-compass-technical-doc.md
  relationship-compass-product-planning-doc.md
```

## 5. 주요 파일 설명

### app/page.tsx

앱의 루트 페이지다. `RelationshipCompassApp` 컴포넌트를 렌더링한다.

### app/layout.tsx

Next.js App Router의 루트 레이아웃이다. 문서 언어는 한국어(`ko`)로 설정했고, 메타데이터에 앱 이름과 설명을 정의했다.

### app/globals.css

Tailwind CSS 기본 지시문과 앱 전체 배경, 기본 폼 스타일을 정의한다. 화면 분위기는 따뜻하고 차분한 종이 질감 계열로 구성했다.

### components/relationship-compass-app.tsx

앱의 핵심 화면을 모두 포함한다.

- 상단 헤더와 첫 문구
- 3개 탭 내비게이션
- Relationship Journal 폼과 저장 목록
- Healing Journal 폼과 3일 후 다시 보기 목록
- Marriage Note 폼과 주제별 노트 목록

MVP 단계에서는 한 파일 안에 탭별 컴포넌트를 함께 두어 흐름을 파악하기 쉽게 했다. 기능이 커지면 각 탭을 개별 파일로 분리할 수 있다.

### components/ui.tsx

공통 UI 컴포넌트 모음이다.

- `Button`
- `Input`
- `Textarea`
- `Label`
- `Field`
- `SectionTitle`
- `EmptyState`

shadcn/ui를 직접 설치하지 않고도 비슷한 사용성을 갖는 가벼운 로컬 컴포넌트로 구성했다. 추후 shadcn/ui를 정식 도입할 경우 이 파일을 기준으로 점진 교체할 수 있다.

### lib/journal-types.ts

앱 데이터 타입을 정의한다.

- `RelationshipEntry`
- `HealingEntry`
- `MarriageNote`
- `JournalData`
- 감정, 필요, 결혼 주제 관련 union type

이 파일은 향후 DB 스키마나 API DTO 설계의 기준점 역할을 한다.

### lib/journal-store.ts

저장소 접근 계층이다. 현재는 localStorage를 사용하지만, 컴포넌트가 직접 localStorage를 만지지 않도록 `journalStore`로 감싸두었다.

제공 메서드:

- `load`
- `saveRelationshipEntry`
- `saveHealingEntry`
- `updateHealingEntry`
- `saveMarriageNote`

향후 SQLite, Supabase, IndexedDB 등으로 확장할 때 이 파일을 저장소 어댑터 경계로 삼을 수 있다.

### lib/utils.ts

날짜와 className 처리를 위한 유틸리티다.

- `cn`
- `formatDate`
- `addDays`
- `today`

## 6. 데이터 모델

### RelationshipEntry

```ts
type RelationshipEntry = {
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
```

의도:

- 만남 자체를 채점하지 않는다.
- 사용자가 느낀 편안함, 배려감, 나다움, 다시 만나고 싶은 마음을 기록한다.
- `ReflectionChoice`는 `예`, `아니오`, `잘 모르겠음`으로 제한해 평가 척도처럼 보이지 않게 했다.

### HealingEntry

```ts
type HealingEntry = {
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
```

의도:

- 사건, 감정, 해석, 다른 가능성, 원하는 것을 분리한다.
- 감정 폭발 방지 노트는 상대에게 보내지 않는 개인 기록으로만 저장된다.
- 저장 시 `revisitDate`가 자동으로 3일 뒤 날짜로 계산된다.
- 3일 후 같은 감정인지 다시 체크할 수 있다.

### MarriageNote

```ts
type MarriageNote = {
  id: string;
  createdAt: string;
  date: string;
  topic: MarriageTopic;
  notes: string;
  gentleNextStep: string;
};
```

의도:

- 결혼 가치관을 한 번에 몰아치지 않는다.
- 하루에 하나의 주제만 작성하게 해 심리적 압박을 낮춘다.
- 정답을 내는 기능이 아니라 대화의 실마리를 정리하는 기능이다.

## 7. 저장 방식

localStorage key:

```text
relationship-compass:v1
```

저장 형태:

```ts
type JournalData = {
  relationshipEntries: RelationshipEntry[];
  healingEntries: HealingEntry[];
  marriageNotes: MarriageNote[];
};
```

저장소 버전이 key에 포함되어 있으므로, 나중에 데이터 구조가 바뀔 때 `relationship-compass:v2` 같은 방식으로 마이그레이션을 설계할 수 있다.

## 8. UX 구현 원칙

기술 구현에서 의도적으로 배제한 것:

- total score
- pass/fail
- recommend/reject
- marry/next 판단 버튼
- 상대를 등급화하는 그래프
- 결론을 강요하는 CTA

대신 구현한 것:

- 기록 저장
- 다시 보기
- 감정과 해석 분리
- 감정의 변화 확인
- 결혼 주제 하루 1개 제한
- 차분한 색상과 낮은 시각적 자극

## 9. 반응형 UI

모바일에서는 단일 컬럼으로 폼과 목록이 순서대로 배치된다. 넓은 화면에서는 폼과 최근 기록 목록이 2열로 배치된다.

주요 Tailwind 패턴:

```text
grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]
sm:grid-cols-2
sm:grid-cols-3
```

## 10. 향후 확장 방향

### 저장소 확장

현재:

```text
components -> journalStore -> localStorage
```

향후:

```text
components -> journalRepository -> SQLite / Supabase / API
```

`journal-store.ts`를 interface 기반으로 바꾸면 저장소 교체가 쉬워진다.

### 추천 분리 작업

기능이 커질 경우 다음처럼 분리할 수 있다.

```text
components/
  relationship/
    relationship-journal.tsx
    relationship-entry-list.tsx
  healing/
    healing-journal.tsx
    healing-entry-list.tsx
  marriage/
    marriage-note-panel.tsx
    marriage-topic-selector.tsx

lib/
  storage/
    journal-store.ts
    local-storage-adapter.ts
```

### 추가 가능 기능

- 데이터 export/import
- 로컬 암호 잠금
- IndexedDB 저장
- SQLite 기반 데스크톱 저장
- Supabase 동기화
- 3일 후 다시 보기 알림
- 태그나 검색

주의할 점: 어떤 확장도 사람을 평가하거나 관계를 자동 판단하는 방향으로 가면 안 된다.

## 11. 검증 기록

수행한 검증:

- `npm install`
- `npm run build`
- 브라우저 첫 화면 렌더링 확인
- Relationship Journal 탭 확인
- Healing Journal 탭 전환 확인
- Marriage Note 탭 전환 확인

확인된 첫 화면 문구:

```text
좋은 관계는 평가에서 시작되는 것이 아니라, 좋은 경험과 건강한 감정 회복이 쌓인 뒤에 함께 미래를 설계하는 것이다.
```

