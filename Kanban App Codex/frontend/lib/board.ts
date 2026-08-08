export type Card = { id: string; title: string; details: string };
export type Column = { id: string; title: string; cards: Card[] };

export const initialColumns: Column[] = [
  { id: "ideas", title: "Ideas", cards: [
    { id: "card-1", title: "Customer interview insights", details: "Turn last week's notes into a concise opportunity brief." },
    { id: "card-2", title: "Mobile onboarding", details: "Map the first five minutes for a new workspace owner." }
  ] },
  { id: "planned", title: "Planned", cards: [
    { id: "card-3", title: "Usage dashboard", details: "Define the essential metrics and the empty state." },
    { id: "card-4", title: "Invite flow refresh", details: "Make adding teammates feel clear and lightweight." }
  ] },
  { id: "building", title: "In progress", cards: [
    { id: "card-5", title: "Command menu", details: "Create a faster path to everyday actions." }
  ] },
  { id: "review", title: "In review", cards: [
    { id: "card-6", title: "Billing settings", details: "Review the final responsive states with design." }
  ] },
  { id: "done", title: "Done", cards: [
    { id: "card-7", title: "Workspace navigation", details: "Ship the streamlined sidebar and project switcher." }
  ] }
];

export function moveCard(columns: Column[], cardId: string, targetColumnId: string): Column[] {
  let moved: Card | undefined;
  const withoutCard = columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => {
      if (card.id === cardId) moved = card;
      return card.id !== cardId;
    })
  }));

  if (!moved) return columns;
  return withoutCard.map((column) => column.id === targetColumnId
    ? { ...column, cards: [...column.cards, moved!] }
    : column);
}

export function deleteCard(columns: Column[], cardId: string): Column[] {
  return columns.map((column) => ({ ...column, cards: column.cards.filter((card) => card.id !== cardId) }));
}
