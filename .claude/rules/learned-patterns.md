# Learned Patterns

Reguły wyciągnięte z rozwiązanych problemów w docs/solutions/. Zarządzane przez /dev-compound i /dev-compound-refresh.

<!-- rule-count: 3 -->

- **Payload `defaultValue` ignoruje `admin.condition`**: pole ukryte w panelu przez `admin.condition` nadal dostaje swój `defaultValue` przy tworzeniu dokumentu przez dowolne API (Local, REST, formularz). Przed pisaniem skryptu backfillującego dla takiego pola - najpierw sprawdź rzeczywisty stan w bazie, nie zakładaj że jest puste.
  Source: docs/solutions/backend-issues/2026-07-21-payload-defaultvalue-applies-despite-hidden-admin-condition.md

- **Skrypty Payload Local API wymagają `process.exit(0)`**: każdy jednorazowy skrypt w `scripts/` łączący się przez `getPayload({ config })` musi kończyć się jawnym `process.exit(0)` (i `process.exit(1)` w catch) - otwarte połączenie MongoDB trzyma event loop, proces nigdy nie kończy się sam.
  Source: docs/solutions/backend-issues/2026-07-21-payload-seed-script-hangs-without-process-exit.md

- **`@testing-library/react` w tym projekcie wymaga jawnego `afterEach(cleanup)`**: `vitest.setup.ts` nie robi tego automatycznie - bez `afterEach(cleanup)` kolejne `render()` w jednym pliku testowym kumulują się w DOM, dając mylące błędy "multiple elements found" w późniejszych testach.
  Source: docs/solutions/testing-issues/2026-07-21-testing-library-react-render-leak-without-cleanup.md
