# Navigation System

How the top navigation bar is built, filtered and rendered — and how to safely re-shape it per client.

The nav is **data-driven**: one config array describes the whole menu, a hook decides what the
current user may see, and a generic renderer draws it. Changing the menu for a client normally
means editing `navConfig.js` only.

---

## 1. The files

| File | Role |
| --- | --- |
| `src/config/navConfig.js` | **The menu definition.** The array `NAV_CONFIG` — edit this to re-shape the menu. |
| `src/hooks/useNavAccess.js` | **Visibility rules.** Returns `filterNav(config)`, which strips items the user must not see. |
| `src/components/layout/NavBar.jsx` | Wires the two together and renders the `<ul>`. |
| `src/components/layout/menu/DynamicMenuItem.jsx` | **Generic renderer.** Draws one top-level item and its sub-menus. |
| `src/layouts/App.layout.jsx` | Mounts `<NavBar />`, but only when logged in. |

Flow:

```
NAV_CONFIG ──▶ useNavAccess.filterNav() ──▶ NavBar ──▶ DynamicMenuItem ──▶ <li> / <NavLink>
   (data)          (who can see what)        (list)        (how it looks)
```

> `src/components/layout/menu/*.menu.jsx` (e.g. `Admin.menu.jsx`) are the **legacy hard-coded
> menus**. They are no longer rendered — `NavBar` uses `NAV_CONFIG`. Do not edit them expecting
> to see a change; treat them as dead code.

---

## 2. Item schema

Every entry in `NAV_CONFIG` (and in any `children` array) supports these fields. None are
enforced by types, so follow the table.

| Field | Type | Applies to | Meaning |
| --- | --- | --- | --- |
| `label` | `string` | all | **Required.** The visible text. |
| `key` | `string` | top level | Unique id. Used as the React list key **and matched against the user's permissions** — see §4. |
| `icon` | component | top level | React-icons component, e.g. `BiSolidFactory`. Only drawn at the top level. |
| `path` | `string` | leaf items | Route to navigate to. Required for anything without `children`. |
| `basePath` | `string` | items with `children` | Prefix used to decide the "active" highlight, e.g. `/admin`. |
| `children` | `array` | groups | Sub-items. Presence of this field turns the item into a dropdown. |
| `allowedRoles` | `string[]` | all | Roles that may see the item (OR). See §4. |
| `requiredNodeCategory` | `string` | all | Hide unless the tenant has a registered node of this category. See §5. |

### The three render shapes

`DynamicMenuItem` supports **exactly three levels**. A fourth level is silently ignored.

```js
// 1. Top-level link — no children. Whole item is clickable.
{ key: "inventory", label: "Inventory", icon: BiSolidStore, path: "/inventory", allowedRoles: [...] }

// 2. Dropdown — has children. Opens on hover; the parent itself is NOT clickable (see §6).
{ key: "admin", label: "Admin", icon: RiAdminFill, basePath: "/admin", allowedRoles: [...],
  children: [
      { label: "All Locations", path: "/admin/location" },
  ]
}

// 3. Nested flyout — a child that itself has children. Renders to the right of the dropdown.
{ key: "admin", label: "Admin", basePath: "/admin",
  children: [
      { label: "User Management", basePath: "/admin/user",
        children: [                                   // ← grandchildren: rendered as plain links
            { label: "Browse Users", path: "/admin/user" },
        ]
      }
  ]
}
```

---

## 3. Adding or changing an item — checklist

1. **The route must already exist** in `src/App.jsx`. `NAV_CONFIG` only links to routes; it does
   not create them. A nav entry pointing at a missing route renders a dead link.
2. Give top-level items a unique `key` (see §4 — it is not just a React key).
3. Groups need `basePath` for the active highlight; leaves need `path`.
4. Set `allowedRoles` to the roles that should see it.
5. If the item is meaningless without a certain kind of node, add `requiredNodeCategory` (§5).
6. Keep nesting to **three levels max**.

---

## 4. Visibility: roles and permissions

In `useNavAccess`, an item is authorised when **either** check passes:

```js
hasRoleAccess       = item.allowedRoles?.some(role => roles.includes(role))
hasPermissionAccess = permissions.includes(item.key)
isAuthorized        = hasRoleAccess || hasPermissionAccess
```

Both `roles` and `permissions` come from the Redux `auth` slice, pre-computed at login in
`src/store/AuthSlice.js`.

### Three traps worth knowing

**(a) `key` is matched against permissions.** `AuthSlice` stores permissions as the part *before*
the colon: the backend permission `"category:read"` becomes `"category"`. So an item with
`key: "category"` is visible to anyone holding any `category:*` permission. Renaming a `key` can
therefore silently change who sees the item.

**(b) Full-access users have `permissions === "*"` — a string, not an array.** So
`permissions.includes(item.key)` runs `String.prototype.includes` and is `false` for every real
key. Owner/company/admin users therefore pass **only** via `allowedRoles`. Practical rule:
**always set `allowedRoles`**; never rely on permissions alone for admin-facing items.

**(c) Children are rendered unfiltered — by design.** `filterNav` recurses into `children`, but
only to decide whether to promote the parent ("if you can see any child, you can see the group").
The filtered result is **not** written back to `clonedItem.children`, so every child of a visible
group renders regardless of its own `allowedRoles`.

This is load-bearing, not an oversight to "fix": most children (e.g. under `Master`) declare no
`allowedRoles`, and because of trap (b) they would all be filtered out for full-access users,
emptying those menus. If you ever want real per-child filtering, you must first give every child
proper `allowedRoles` and fix the `"*"` permission check.

The one exception is `requiredNodeCategory`, which *is* applied to children at any depth via
`stripNodeGated()` — because a route with no backing node is broken for everyone, regardless of role.

---

## 5. Visibility: `requiredNodeCategory` (node-aware menus)

Some routes are useless unless the tenant actually has a node of a given category. Example:
**Production** and **Internal Stores & Units** only make sense with a `manufacturing` node.

```js
{
    key: "production",
    label: "Production",
    basePath: "/production",
    allowedRoles: ["system", "store_rm", "store_wip", "store_fg", "company"],
    requiredNodeCategory: "manufacturing",   // ← hidden when the tenant has no manufacturing node
}
```

**Where the data comes from.** `useNavAccess` calls `business.TQRegisteredNodeCount()`
(`GET /business/registered-node-count`), which returns one row per node type with its `category`
and `count`. The hook builds a `Set` of categories having `count > 0` and hides any item whose
`requiredNodeCategory` is missing from it.

Current categories: `manufacturing`, `warehouse`, `partner`.

**Why this endpoint and not `/business/node-list`.** `/business/node-list` is gated by
`verifyPermission("business-node: read")`. Driving the navbar from it would return 403 for exactly
the non-admin roles that need Production (e.g. `store_rm`) and hide the menu from them.
`/business/registered-node-count` is authenticated and tenant-scoped but **not** permission-gated,
so it answers identically for every role. If you add a new gating source, keep that property.

**Self-updating.** Registering or deleting a location invalidates the `registeredNodeCount` query,
so the menu appears/disappears without a reload.

**Failure behaviour — deliberate:**

| State | Behaviour | Why |
| --- | --- | --- |
| Request in flight | Gated items **hidden** | Better than showing an item that vanishes under the cursor. |
| Request failed | Gating **skipped**, items shown | A backend hiccup must not delete navigation. |

A consequence: if the backend has not been restarted with the `/registered-node-count` route, the
menu behaves exactly as before rather than losing entries.

---

## 6. Renderer quirks (`DynamicMenuItem`)

Read these before blaming the config:

- **Parent items are not clickable.** A dropdown's button is `!cursor-default` and does nothing —
  except `key === "master"`, which is special-cased to navigate to its `path`. If a client wants a
  clickable group, that special case is where to generalise it.
- **Active highlight is substring-based:** `location.pathname.includes(item.path)`. Sibling routes
  sharing a prefix (`/order` vs `/order/bpo`) will both light up. `/` is special-cased to an exact
  match. If you add a route that is a prefix of another, expect a double highlight.
- **`icon` only renders at the top level.** Icons on children are ignored.
- **Grandchildren are plain `NavLink`s.** Any `children` on a grandchild is ignored (3-level cap).
- Sub-menus open on **hover** via CSS (`.sub-menu`), not React state.

---

## 7. Recipes

**Remove a page from the nav but keep the route reachable**
Delete the entry from `NAV_CONFIG`. The route in `App.jsx` still works for direct links and
programmatic `navigate()` — this is how `/admin/location/register` and `/admin/user/register` work
now: they were removed from the nav and are reached only from the "+" buttons on their list pages.

**Collapse a group with one child into a plain link**

```js
// before                                          // after
{ label: "User Management",                        { label: "User Management",
  basePath: "/admin/user",                           path: "/admin/user" }
  children: [{ label: "Browse", path: "/admin/user" }] }
```

**Hide a whole section for a client** — remove its `allowedRoles` entries, or delete the top-level
object. Deleting is clearer when the client will never use the module.

**Gate a section on a different node type** — add `requiredNodeCategory: "<category>"`. If you need
a condition that is not a node category (e.g. a feature flag), add a sibling field and a matching
check in `useNavAccess`; keep the "skip gating on lookup failure" behaviour.

**Reorder the menu** — reorder the array. Render order is array order.

---

## 8. A richer access model exists but is unused

`src/utils/roles.js` exports `checkAccess(accessRules, ctx)`, supporting `roles`, `permissions`,
`userTypes`, `nodeTypes`, `nodeCategories` and `departments`, with hard-block vs soft-match
semantics. It is imported by `useNavAccess` but **never called** — the simpler
`allowedRoles || key-in-permissions` logic is what actually runs.

If a client needs per-department or per-node-type menus, wiring `checkAccess` in is the intended
path. It expects an `access: { ... }` object on the item rather than the flat `allowedRoles` field,
so migrating means touching every entry — do it wholesale, not per item, and note that it currently
`console.log`s on every call.
