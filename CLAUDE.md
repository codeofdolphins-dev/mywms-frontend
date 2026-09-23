# CLAUDE.md

This file guides Claude Code (claude.ai/code) when it works in this repository.

## Project

MyWMS frontend. It is a multi-tenant warehouse / supply-chain management SPA covering masters, requisitions, quotations, purchase orders, inward (GRN), outward, inventory, production stores (RM / WIP / FG), direct transfers, expenses and B2B connections. The UI started from the Vristo admin template, so many template leftovers remain (see "Dead code" below).

## Commands

- `npm run dev`: Vite dev server on port **5180**
- `npm run build`: `vite build && tsc` (tsc is a type-check only, with `noEmit`)
- `npm run preview`: serve `dist/`

There is **no linter and no test suite**. To check a change, run `npx vite build`. The repo uses `bun.lock`, but `bun.*` is gitignored.

Environment (`.env`, see `.env.sample`):
- `VITE_SERVER_URL`: API base URL, e.g. `http://localhost:4000/api`
- `VITE_ASSETS`: static assets URL, exposed as `ASSETS_URL` in `src/utils/helper.js`

## Stack

React 18 + Vite 5, react-router-dom v6 (`createBrowserRouter`), TanStack Query v5 for server state, Redux Toolkit for auth and location state only, react-hook-form for forms, Mantine v5 plus Tailwind 3 for UI, SweetAlert2 for alerts and confirmations, react-icons. The code is mostly `.jsx`/`.js`. TypeScript appears only in `main.tsx`, `Master.tsx`, `Dropdown.tsx` and the template `Icon/*.tsx` files (`checkJs: false`). The `@/` alias maps to `src/`, but most imports are relative.

Formatting (`.prettierrc`, `.editorconfig`): 4-space indent, semicolons, double quotes, print width 200.

## Architecture

### Bootstrapping and auth
- `src/main.tsx` wraps the app in the Redux `Provider`, `HelmetProvider` and `QueryClientProvider` (`refetchOnWindowFocus: false`, `retry: 1`).
- `src/App.jsx` holds **all routes in one file**. `/auth/*` uses `AuthLayout`. Everything else is nested under `/` → `AppLayout`.
- `src/layouts/AuthBootstrap.jsx` reads the token from `react-secure-storage`. It fetches `/user/current-user` and `/location/state`, then dispatches `storeLogin` and `storeLocation`. If there is no token, it redirects to `/auth/login`, except on `/`.
- `src/Backend/index.js` is the shared axios instance. It attaches `Authorization: Bearer <token>` and `x-tenant-id` from secure storage. It has **no response interceptor**, so 401s are not handled globally.
- `src/store/AuthSlice.js`: `storeLogin` pre-computes `roles` (string[]) and `permissions`. `permissions` is `"*"` for "all access" roles. Otherwise it is a deduped array of permission prefixes (the part before `:`).
- The current user's active node is `state.auth.userData.activeNode`. Many screens branch on `activeNode.NodeUser.department` and on the node category.

### Navigation and access control
Read `src/config/NAVIGATION.md` before touching the menu.
- `src/config/navConfig.js` (`NAV_CONFIG`) defines the menu as data. `useNavAccess().filterNav` filters it. `components/layout/NavBar.jsx` and `menu/DynamicMenuItem.jsx` render it.
- Visibility = `allowedRoles` match OR `permissions.includes(item.key)`, and the item is also gated by `requiredNodeCategory` against the tenant's registered node counts.
- `src/components/layout/menu/*.menu.jsx` are legacy and **not rendered**.
- Hiding a nav item does not protect its route. Routes have no guards apart from the role redirects in `src/guards/StoreRoute.jsx` (`HomeRoute`, `StoreRoute`).

### Data layer (`src/Backend/`)
Each domain file exports a **singleton class instance whose methods are hooks**, for example `fetchData.TQStateList()` or `business.TQTenantRegisteredNodeList(params, enabled)`. Call them only at the top level of a component, like any hook.
- Query methods follow the signature `TQXxx(params = {}, isEnabled = true)`. The query key is `["xxxList", params]`, and many use `select: (d) => d.data`.
- For writes, use the generic mutations in `master.backend.js`: `TQCreateMaster(keys)`, `TQUpdateMaster(keys)` and `TQDeleteMaster(keys)`. Call them as `mutateAsync({ path, formData })`. They show success and error alerts and invalidate the listed query keys. **When you add a list query, pass its key to the mutations that change it**, or the list will go stale.
- `fetchData.backend.js` is a large grab-bag of shared list queries. Domain files hold the rest (`inward.fetch.js`, `order.fetch.js`, `production.fetch.js`, and so on). `Backend/downloads/` handles Excel and PDF downloads.

### Screens and components
- `src/screens/<domain>/` holds the route-level pages. Many domains keep a `helper.js` with table columns and constants for that domain. `src/utils/helper.js` holds the shared column definitions (`*_COLUMN`).
- `src/components/` holds shared UI: `inputs/` (with react-hook-form wrappers in `inputs/RHF/`), `table/` (`TableHeader`, `TableBody`, `TableRow`), `Add.modal.jsx`, `BasicPagination.jsx`, and loaders.
- Use `src/utils/alerts.js` for user feedback (`successAlert`, `errorAlert`, `confirmation`, `errorToastAlert`, …). Use `currencyFormatter` for money and `helper/calculateTotals.js` for line-item totals.
- Pages set their title with `react-helmet-async`.

## TanStack Query v5 gotchas (these are common in this codebase)
- `useQuery` **no longer supports `onSuccess` / `onError`**. The many such callbacks inside `useQuery` calls in `src/Backend/*` never run. Put side effects in `useEffect` or in the `queryFn`. The callbacks still work on `useMutation`.
- For mutations, the loading flag is `isPending`, not `isLoading`. Several files still destructure `isLoading` from mutations (`CreateStoreForm.jsx`, `Brand.jsx`, `Expense.jsx`), and it is always `undefined` there.
- The shared `onError` handlers read `error.response.data`. On a network error `response` is undefined, so use `error.response?.data`.

## Dead code / leftovers (don't extend, and verify before relying on them)
- `src/Backend/business.fetch copy.js`, `src/screens/requisition/CreateRequisition copy.jsx`: stale copies.
- `src/screens/CreateInward.jsx`: mounted at `/test`. The real page is `src/screens/inward/CreateInward.jsx`.
- `src/components/layout/menu/*.menu.jsx`: legacy menus.
- Most of `src/components/Icon/*` and the template notifications in `Header.jsx`. Prefer `react-icons`.
- Unused dependencies from the template: formik, fullcalendar, apexcharts, quill/easymde, swiper, flatpickr, text-mask, nouislider, highlight.js, the lightbox and image-uploading packages, react-export-table-to-excel, and others.

The production build is a single ~1.7 MB JS chunk because no routes are lazy-loaded.
