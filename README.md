# devboard

A Kanban board for planning work as boards, columns, and draggable task cards. It runs entirely in the browser — no backend, no sign-up — and your boards persist between visits, so it loads instantly and keeps working offline.

## What it does

- Create multiple **boards**, each with its own columns
- Add and rename **columns**, and drag to reorder them
- Add **task cards** with a description, priority, and due date
- **Drag and drop** cards within a column or across columns
- Delete a board or column and its cards are cleaned up with it
- Light / dark theme, with a mobile layout where task forms open in a drawer

## Stack

- **React 19 + TypeScript**, built with **Vite**
- **TanStack Router** — type-safe, file-based routing (`/board/:boardId`)
- **dnd-kit** — drag-and-drop for cards and columns
- **Zustand** (persist middleware) — state saved to local storage
- **React Hook Form + Zod** — validated board and task forms
- **Tailwind CSS v4 + shadcn/ui** — interface
- **Motion / GSAP / OGL** — the animated background visuals

## Design notes

- **No backend, on purpose.** The whole data model — boards, columns, tasks — lives in one Zustand store persisted to local storage under a single key. That keeps the app deployable as a static site and makes the store the single source of truth; the UI and drag handlers only dispatch actions to it.
- **Deletes cascade.** Removing a board also removes its columns and their tasks; removing a column removes its tasks, so there are no orphaned records left behind.
- **Schemas drive the forms and the types.** Board and task shapes are Zod schemas in `src/schemas`, reused for validation and to derive the TypeScript types, so a form and the store can't drift apart.

## Run it locally

```bash
npm install
npm run dev
```

Vite prints the local URL to open.

## Where things live

- `src/routes/` — file-based routes (TanStack Router)
- `src/store/use-board-store.ts` — the persisted board / column / task state
- `src/components/pages/board/` — columns, cards, and task forms
- `src/hooks/use-board-dnd.ts` — drag-and-drop wiring
- `src/schemas/` — Zod schemas shared by forms and types
