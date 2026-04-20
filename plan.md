# Implementation Plan - Material Consumption Module

## 1. Data Models
- Create `src/models/consumption.ts` with the `Consumption` interface.
  - Fields: `id`, `itemCode`, `description`, `UOM`, `issuedQty`, `returnedQty`, `wasteQty`, `remark`, `date`.

## 2. Service Layer
- Create `src/services/consumption-service.ts`.
  - Implement CRUD operations using the Axios instance from `src/lib/api.ts`.
  - Functions: `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`.

## 3. UI/UX - Material Consumption Page
- Update `src/pages/consumption/consumption-page.tsx`.
  - Replace raw inputs with UI components (`Input`, `Button`, `Card`, `Table`).
  - Implement the form with validation: `returnedQty + wasteQty <= issuedQty`.
  - Calculate `Net consumption = issuedQty - returnedQty`.
  - Add a table to display existing consumption records.
  - Use `sonner` for toast notifications.

## 4. Routing and Navigation
- Verify `src/App.tsx` has the `/consumption` route.
- Verify `src/components/layout/dashboard-layout.tsx` has the "Consumption" link.
