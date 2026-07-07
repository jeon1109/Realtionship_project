"use client";

import { useEffect, useMemo, useState } from "react";
import { BookHeart, CalendarClock, HeartHandshake, NotebookPen, ShieldCheck } from "lucide-react";
import type {
  FeelingTone,
  HealingEntry,
  JournalData,
  MarriageNote,
  MarriageTopic,
  NeedType,
  ReflectionChoice,
  RelationshipEntry,
} from "@/lib/journal-types";
import { emptyJournalData, journalStore } from "@/lib/journal-store";
import { addDays, cn, formatDate, today } from "@/lib/utils";
import { Button, EmptyState, Field, Input, SectionTitle, Textarea } from "@/components/ui";

type TabKey = "relationship" | "healing" | "marriage";

const reflectionChoices: ReflectionChoice[] = ["예", "아니오", "잘 모르겠음"];
const feelingOptions: FeelingTone[] = ["서운함", "실망", "불안", "화남", "외로움", "답답함", "혼란", "슬픔"];
const needOptions: NeedType[] = ["사과", "공감", "해결", "행동", "시간", "휴식"];
const marriageTopics: MarriageTopic[] = [
  "돈 관리",
  "직업과 커리어",
  "부모님과 원가족",
  "형제자매 문제",
  "자녀 계획",
  "주거 계획",
  "갈등 해결 방식",
  "서로의 역할",
  "우리가 만들고 싶은 가정",
];

function newId() {
  return crypto.randomUUID();
}

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(active ? selected.filter((item) => item !== option) : [...selected, option])}
            className={cn(
              "min-h-10 rounded-md border px-3 py-2 text-sm transition",
              active
                ? "border-meadow bg-meadow text-white"
                : "border-[#d8cebd] bg-white/70 text-[#4b463f] hover:border-meadow/70",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function ChoiceGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "min-h-11 rounded-md border px-3 py-2 text-sm transition",
            value === option
              ? "border-meadow bg-meadow text-white"
              : "border-[#d8cebd] bg-white/70 text-[#4b463f] hover:border-meadow/70",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function RelationshipJournal({
  entries,
  onSave,
}: {
  entries: RelationshipEntry[];
  onSave: (entry: RelationshipEntry) => Promise<void> | void;
}) {
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    date: today(),
    activity: "",
    laughedTogether: "잘 모르겠음" as ReflectionChoice,
    feltComfortable: "잘 모르겠음" as ReflectionChoice,
    feltConsidered: "잘 모르겠음" as ReflectionChoice,
    feltAuthentic: "잘 모르겠음" as ReflectionChoice,
    wishToMeetAgain: "",
    memo: "",
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      await onSave({
        id: newId(),
        createdAt: new Date().toISOString(),
        ...form,
      });
      setForm({
        date: today(),
        activity: "",
        laughedTogether: "잘 모르겠음",
        feltComfortable: "잘 모르겠음",
        feltConsidered: "잘 모르겠음",
        feltAuthentic: "잘 모르겠음",
        wishToMeetAgain: "",
        memo: "",
      });
    } catch (error) {
      console.error(error);
      setFormError("저장 중 문제가 발생했습니다. Supabase 환경변수와 테이블 권한을 확인해주세요.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <form onSubmit={submit} className="space-y-5 rounded-md border border-[#ded5c5] bg-white/70 p-5 shadow-soft">
        <SectionTitle
          title="Relationship Journal"
          subtitle="만남 뒤 남는 몸의 느낌, 마음의 여운, 나다움의 정도를 천천히 적어두는 공간입니다."
        />
        {formError ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{formError}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="날짜">
            <Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          </Field>
          <Field label="함께한 활동">
            <Input
              value={form.activity}
              onChange={(event) => setForm({ ...form, activity: event.target.value })}
              placeholder="산책, 식사, 전시, 통화..."
              required
            />
          </Field>
        </div>
        <Field label="오늘 같이 웃었는가">
          <ChoiceGroup
            options={reflectionChoices}
            value={form.laughedTogether}
            onChange={(value) => setForm({ ...form, laughedTogether: value })}
          />
        </Field>
        <Field label="편안함을 느꼈는가">
          <ChoiceGroup
            options={reflectionChoices}
            value={form.feltComfortable}
            onChange={(value) => setForm({ ...form, feltComfortable: value })}
          />
        </Field>
        <Field label="배려받았다고 느꼈는가">
          <ChoiceGroup
            options={reflectionChoices}
            value={form.feltConsidered}
            onChange={(value) => setForm({ ...form, feltConsidered: value })}
          />
        </Field>
        <Field label="내가 나답게 있을 수 있었는가">
          <ChoiceGroup
            options={reflectionChoices}
            value={form.feltAuthentic}
            onChange={(value) => setForm({ ...form, feltAuthentic: value })}
          />
        </Field>
        <Field label="다시 만나고 싶은 마음">
          <Textarea
            value={form.wishToMeetAgain}
            onChange={(event) => setForm({ ...form, wishToMeetAgain: event.target.value })}
            placeholder="끌림, 궁금함, 쉬고 싶은 마음 등 그대로 적어보세요."
          />
        </Field>
        <Field label="자유 메모">
          <Textarea
            value={form.memo}
            onChange={(event) => setForm({ ...form, memo: event.target.value })}
            placeholder="좋았던 순간, 낯설었던 장면, 다음에 확인하고 싶은 감각..."
          />
        </Field>
        <Button type="submit">
          <NotebookPen size={18} />
          기록 저장
        </Button>
      </form>

      <EntryList title="최근 관계 기록">
        {entries.length === 0 ? (
          <EmptyState>아직 저장된 만남 기록이 없습니다. 첫 기록은 짧아도 충분합니다.</EmptyState>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="rounded-md border border-[#ded5c5] bg-white/70 p-4">
              <p className="text-xs font-semibold text-meadow">{formatDate(entry.date)}</p>
              <h3 className="mt-1 font-bold text-ink">{entry.activity}</h3>
              <dl className="mt-3 grid gap-2 text-sm text-[#5f5a50]">
                <div className="flex justify-between gap-3">
                  <dt>함께 웃음</dt>
                  <dd>{entry.laughedTogether}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>편안함</dt>
                  <dd>{entry.feltComfortable}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>나다움</dt>
                  <dd>{entry.feltAuthentic}</dd>
                </div>
              </dl>
              {entry.memo ? <p className="mt-3 text-sm leading-6 text-[#4f4a42]">{entry.memo}</p> : null}
            </article>
          ))
        )}
      </EntryList>
    </div>
  );
}

function HealingJournal({
  entries,
  onSave,
  onUpdate,
}: {
  entries: HealingEntry[];
  onSave: (entry: HealingEntry) => Promise<void> | void;
  onUpdate: (entry: HealingEntry) => Promise<void> | void;
}) {
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    date: today(),
    event: "",
    feelings: [] as FeelingTone[],
    interpretedMeaning: "",
    otherPossibilities: "",
    emotionOrValue: "아직 모르겠음" as HealingEntry["emotionOrValue"],
    wanted: [] as NeedType[],
    timing: "3일 뒤 다시 보기" as HealingEntry["timing"],
    privateRelease: "",
  });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      await onSave({
        id: newId(),
        createdAt: new Date().toISOString(),
        ...form,
        revisitDate: addDays(form.date, 3),
      });
      setForm({
        date: today(),
        event: "",
        feelings: [],
        interpretedMeaning: "",
        otherPossibilities: "",
        emotionOrValue: "아직 모르겠음",
        wanted: [],
        timing: "3일 뒤 다시 보기",
        privateRelease: "",
      });
    } catch (error) {
      console.error(error);
      setFormError("저장 중 문제가 발생했습니다. Supabase 환경변수와 테이블 권한을 확인해주세요.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <form onSubmit={submit} className="space-y-5 rounded-md border border-[#ded5c5] bg-white/70 p-5 shadow-soft">
        <SectionTitle
          title="Healing Journal"
          subtitle="서운함을 바로 결론으로 만들지 않고, 마음이 진정될 자리를 먼저 마련합니다."
        />
        {formError ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{formError}</p> : null}
        <Field label="날짜">
          <Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
        </Field>
        <Field label="실제로 있었던 일">
          <Textarea
            value={form.event}
            onChange={(event) => setForm({ ...form, event: event.target.value })}
            placeholder="해석을 잠시 내려놓고, 관찰 가능한 사실만 적어보세요."
            required
          />
        </Field>
        <Field label="내가 느낀 감정">
          <MultiSelect
            options={feelingOptions}
            selected={form.feelings}
            onChange={(next) => setForm({ ...form, feelings: next as FeelingTone[] })}
          />
        </Field>
        <Field label="내가 해석한 의미">
          <Textarea
            value={form.interpretedMeaning}
            onChange={(event) => setForm({ ...form, interpretedMeaning: event.target.value })}
            placeholder="예: 나를 우선순위로 두지 않는 것 같았다."
          />
        </Field>
        <Field label="다른 가능성">
          <Textarea
            value={form.otherPossibilities}
            onChange={(event) => setForm({ ...form, otherPossibilities: event.target.value })}
            placeholder="컨디션, 상황, 말의 습관 등 다른 설명이 있을까요?"
          />
        </Field>
        <Field label="이 감정은 감정인지 가치관인지">
          <ChoiceGroup
            options={["감정", "가치관", "둘 다", "아직 모르겠음"]}
            value={form.emotionOrValue}
            onChange={(value) => setForm({ ...form, emotionOrValue: value })}
          />
        </Field>
        <Field label="내가 원하는 것">
          <MultiSelect
            options={needOptions}
            selected={form.wanted}
            onChange={(next) => setForm({ ...form, wanted: next as NeedType[] })}
          />
        </Field>
        <Field label="지금 바로 말할 것인지, 3일 뒤 다시 볼 것인지">
          <ChoiceGroup
            options={["지금 말하기", "3일 뒤 다시 보기"]}
            value={form.timing}
            onChange={(value) => setForm({ ...form, timing: value })}
          />
        </Field>
        <Field label="감정 폭발 방지 노트" hint="상대에게 보내지 않고 내 노트에만 저장됩니다. 거칠게 적어도 괜찮습니다.">
          <Textarea
            value={form.privateRelease}
            onChange={(event) => setForm({ ...form, privateRelease: event.target.value })}
            placeholder="지금 튀어나오려는 말을 안전하게 여기에 내려놓기..."
          />
        </Field>
        <Button type="submit">
          <ShieldCheck size={18} />
          회복 기록 저장
        </Button>
      </form>

      <EntryList title="3일 후 다시 보기">
        {entries.length === 0 ? (
          <EmptyState>감정 회복 기록이 쌓이면 이곳에서 다시 확인할 수 있습니다.</EmptyState>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="rounded-md border border-[#ded5c5] bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-meadow">{formatDate(entry.date)}</p>
                <span className="rounded-md bg-linen px-2 py-1 text-xs text-[#625a4e]">
                  다시 보기: {formatDate(entry.revisitDate)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#4f4a42]">{entry.event}</p>
              <p className="mt-2 text-xs text-[#70695e]">감정: {entry.feelings.join(", ") || "미기록"}</p>
              <div className="mt-4 space-y-3 border-t border-[#e4dccf] pt-4">
                <Field label="3일 후에도 같은 감정인가요?">
                  <ChoiceGroup
                    options={["같음", "약해짐", "달라짐", "아직 모르겠음"]}
                    value={entry.revisitSameFeeling ?? "아직 모르겠음"}
                    onChange={(value) => onUpdate({ ...entry, revisitSameFeeling: value })}
                  />
                </Field>
                <Field label="다시 본 뒤 메모">
                  <Textarea
                    value={entry.revisitMemo ?? ""}
                    onChange={(event) => onUpdate({ ...entry, revisitMemo: event.target.value })}
                    placeholder="시간이 지난 뒤 달라진 느낌이나 여전히 남은 필요..."
                  />
                </Field>
              </div>
            </article>
          ))
        )}
      </EntryList>
    </div>
  );
}

function MarriageNotePanel({
  notes,
  onSave,
}: {
  notes: MarriageNote[];
  onSave: (note: MarriageNote) => Promise<void> | void;
}) {
  const [formError, setFormError] = useState("");
  const usedToday = useMemo(
    () => notes.some((note) => note.date === today()),
    [notes],
  );
  const [topic, setTopic] = useState<MarriageTopic>("돈 관리");
  const [noteText, setNoteText] = useState("");
  const [gentleNextStep, setGentleNextStep] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      await onSave({
        id: newId(),
        createdAt: new Date().toISOString(),
        date: today(),
        topic,
        notes: noteText,
        gentleNextStep,
      });
      setNoteText("");
      setGentleNextStep("");
    } catch (error) {
      console.error(error);
      setFormError("저장 중 문제가 발생했습니다. Supabase 환경변수와 테이블 권한을 확인해주세요.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <form onSubmit={submit} className="space-y-5 rounded-md border border-[#ded5c5] bg-white/70 p-5 shadow-soft">
        <SectionTitle
          title="Marriage Note"
          subtitle="결혼 이야기를 한 번에 몰아치지 않도록 오늘은 하나의 주제만 조용히 펼쳐봅니다."
        />
        {formError ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{formError}</p> : null}
        {usedToday ? (
          <div className="rounded-md border border-meadow/30 bg-mist/70 p-4 text-sm leading-6 text-[#465a4d]">
            오늘의 결혼 가치관 주제는 이미 하나 작성했습니다. 더 쓰고 싶다면 기존 노트를 읽으며 생각만 덧붙여보세요.
          </div>
        ) : null}
        <Field label="오늘의 주제 1개만 선택">
          <div className="grid gap-2 sm:grid-cols-2">
            {marriageTopics.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setTopic(item)}
                className={cn(
                  "min-h-11 rounded-md border px-3 py-2 text-left text-sm transition",
                  topic === item
                    ? "border-meadow bg-meadow text-white"
                    : "border-[#d8cebd] bg-white/70 text-[#4b463f] hover:border-meadow/70",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </Field>
        <Field label="오늘 이 주제에 대해 떠오르는 생각">
          <Textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="정답을 내기보다, 내가 편안하게 살기 위해 중요한 기준을 적어보세요."
            required
            disabled={usedToday}
          />
        </Field>
        <Field label="부드러운 다음 대화의 실마리">
          <Textarea
            value={gentleNextStep}
            onChange={(event) => setGentleNextStep(event.target.value)}
            placeholder="언젠가 대화한다면 어떤 질문으로 시작하면 좋을까요?"
            disabled={usedToday}
          />
        </Field>
        <Button type="submit" disabled={usedToday}>
          <HeartHandshake size={18} />
          오늘의 주제 저장
        </Button>
      </form>

      <EntryList title="차곡차곡 모인 가치관">
        {notes.length === 0 ? (
          <EmptyState>관계 경험이 충분히 쌓였다고 느껴질 때, 하루에 한 주제씩 시작해보세요.</EmptyState>
        ) : (
          notes.map((note) => (
            <article key={note.id} className="rounded-md border border-[#ded5c5] bg-white/70 p-4">
              <p className="text-xs font-semibold text-meadow">{formatDate(note.date)}</p>
              <h3 className="mt-1 font-bold text-ink">{note.topic}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4f4a42]">{note.notes}</p>
              {note.gentleNextStep ? (
                <p className="mt-3 rounded-md bg-linen p-3 text-sm leading-6 text-[#5c554a]">{note.gentleNextStep}</p>
              ) : null}
            </article>
          ))
        )}
      </EntryList>
    </div>
  );
}

function EntryList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="space-y-4">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="max-h-[calc(100vh-9rem)] space-y-3 overflow-auto pr-1">{children}</div>
    </aside>
  );
}

export function RelationshipCompassApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("relationship");
  const [data, setData] = useState<JournalData>(emptyJournalData);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    setData(await journalStore.load());
  }

  const tabs = [
    { key: "relationship" as const, label: "Relationship Journal", icon: BookHeart },
    { key: "healing" as const, label: "Healing Journal", icon: CalendarClock },
    { key: "marriage" as const, label: "Marriage Note", icon: HeartHandshake },
  ];

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="space-y-5 rounded-md border border-[#ded5c5] bg-white/60 p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-meadow">Relationship Compass</p>
              <h1 className="mt-1 text-3xl font-bold tracking-normal text-ink sm:text-4xl">관계를 평가하지 않는 기록장</h1>
            </div>
          </div>
          <p className="max-w-4xl text-lg leading-8 text-[#4f4a42]">
            “좋은 관계는 평가에서 시작되는 것이 아니라, 좋은 경험과 건강한 감정 회복이 쌓인 뒤에 함께 미래를 설계하는 것이다.”
          </p>
        </header>

        <nav className="grid gap-2 rounded-md border border-[#ded5c5] bg-white/55 p-2 shadow-sm sm:grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex min-h-12 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                  activeTab === tab.key ? "bg-ink text-white" : "text-[#4f4a42] hover:bg-white/80",
                )}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {activeTab === "relationship" ? (
          <RelationshipJournal
            entries={data.relationshipEntries}
            onSave={async (entry) => {
              await journalStore.saveRelationshipEntry(entry);
              await refresh();
            }}
          />
        ) : null}
        {activeTab === "healing" ? (
          <HealingJournal
            entries={data.healingEntries}
            onSave={async (entry) => {
              await journalStore.saveHealingEntry(entry);
              await refresh();
            }}
            onUpdate={async (entry) => {
              await journalStore.updateHealingEntry(entry);
              await refresh();
            }}
          />
        ) : null}
        {activeTab === "marriage" ? (
          <MarriageNotePanel
            notes={data.marriageNotes}
            onSave={async (note) => {
              await journalStore.saveMarriageNote(note);
              await refresh();
            }}
          />
        ) : null}
      </div>
    </main>
  );
}
