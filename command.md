# Migracja lokalizacji na produkcyjnej bazie

Kontener appki (`mcraft-app-1`) to standalone build Next.js - brak `scripts/`, `pnpm`, `tsx`.
Migracja odpalana bezposrednio w kontenerze mongo (`mcraft-mongo-1`) przez `mongosh`,
jako czysty JS port `scripts/lib/localize-migration-helpers.ts` + `scripts/migrate-localize-content.ts`.

Idempotentne - dotyka tylko pol ktore jeszcze nie sa w formacie `{ pl: ... }` / `{ en: ... }`.

Odpal w SSH na VPS (`root@vmi2959994`):

```bash
docker exec -i mcraft-mongo-1 mongosh mcraft <<'EOF'
(async function () {
  function isAlreadyLocalized(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
    return ('pl' in value || 'en' in value) && !('root' in value);
  }

  function localizeField(doc, field) {
    const value = doc[field];
    if (value === undefined || value === null) return false;
    if (isAlreadyLocalized(value)) return false;
    doc[field] = { pl: value };
    return true;
  }

  function localizeArrayField(doc, arrayField, subFields) {
    const items = doc[arrayField];
    if (!Array.isArray(items)) return false;
    let changed = false;
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      for (const sub of subFields) {
        if (localizeField(item, sub)) changed = true;
      }
    }
    return changed;
  }

  function migrateServicePage(doc) {
    let changed = false;
    if (localizeField(doc, 'eyebrow')) changed = true;
    if (localizeField(doc, 'title')) changed = true;
    if (localizeField(doc, 'description')) changed = true;
    if (localizeArrayField(doc, 'scopeItems', ['text', 'description', 'modalDescription'])) changed = true;
    if (localizeField(doc, 'audienceTitle')) changed = true;
    if (localizeArrayField(doc, 'audienceItems', ['text'])) changed = true;
    const sections = doc.additionalSections;
    if (Array.isArray(sections)) {
      for (const section of sections) {
        if (!section || typeof section !== 'object') continue;
        if (localizeField(section, 'title')) changed = true;
        if (localizeArrayField(section, 'items', ['text'])) changed = true;
      }
    }
    if (localizeField(doc, 'ctaHeader')) changed = true;
    if (localizeField(doc, 'thumbnailTitle')) changed = true;
    return changed;
  }

  function migratePortfolio(doc) {
    let changed = false;
    if (localizeField(doc, 'title')) changed = true;
    if (localizeField(doc, 'slug')) changed = true;
    if (localizeField(doc, 'description')) changed = true;
    if (localizeArrayField(doc, 'images', ['alt'])) changed = true;
    return changed;
  }

  function migrateStatTile(doc) {
    let changed = false;
    if (localizeField(doc, 'label')) changed = true;
    if (localizeField(doc, 'description')) changed = true;
    return changed;
  }

  function migrateHeroSection(doc) {
    let changed = false;
    if (localizeField(doc, 'subtitle')) changed = true;
    if (localizeField(doc, 'description')) changed = true;
    return changed;
  }

  function migrateAboutSection(doc) {
    return localizeField(doc, 'bioText');
  }

  function migrateCvModal(doc) {
    let changed = false;
    if (localizeArrayField(doc, 'experience', ['description', 'company'])) changed = true;
    if (localizeArrayField(doc, 'qualifications', ['description'])) changed = true;
    if (localizeArrayField(doc, 'education', ['institution', 'description'])) changed = true;
    if (localizeArrayField(doc, 'additionalQualifications', ['description'])) changed = true;
    if (localizeField(doc, 'skills')) changed = true;
    if (localizeField(doc, 'interests')) changed = true;
    return changed;
  }

  function migrateBioModal(doc) {
    return localizeArrayField(doc, 'sections', ['title', 'content']);
  }

  async function migrateCollection(name, migrateFn) {
    const docs = await db.getCollection(name).find({}).toArray();
    let count = 0;
    for (const doc of docs) {
      if (migrateFn(doc)) {
        await db.getCollection(name).replaceOne({ _id: doc._id }, doc);
        count++;
      }
    }
    return count;
  }

  async function migrateGlobal(globalType, migrateFn) {
    const doc = await db.getCollection('globals').findOne({ globalType });
    if (!doc) return false;
    if (migrateFn(doc)) {
      await db.getCollection('globals').replaceOne({ _id: doc._id }, doc);
      return true;
    }
    return false;
  }

  const spCount = await migrateCollection('service-pages', migrateServicePage);
  const pfCount = await migrateCollection('portfolio-projects', migratePortfolio);
  const stCount = await migrateCollection('stat-tiles', migrateStatTile);
  const heroChanged = await migrateGlobal('hero-section', migrateHeroSection);
  const aboutChanged = await migrateGlobal('about-section', migrateAboutSection);
  const cvChanged = await migrateGlobal('cv-modal', migrateCvModal);
  const bioChanged = await migrateGlobal('bio-modal', migrateBioModal);

  print('Migracja zakonczona:');
  print('  service-pages: ' + spCount + ' dokumentow zmigrowanych');
  print('  portfolio-projects: ' + pfCount + ' dokumentow zmigrowanych');
  print('  stat-tiles: ' + stCount + ' dokumentow zmigrowanych');
  print('  hero-section: ' + (heroChanged ? 'zmigrowano' : 'bez zmian'));
  print('  about-section: ' + (aboutChanged ? 'zmigrowano' : 'bez zmian'));
  print('  cv-modal: ' + (cvChanged ? 'zmigrowano' : 'bez zmian'));
  print('  bio-modal: ' + (bioChanged ? 'zmigrowano' : 'bez zmian'));
})()
EOF
```

Jesli `mongosh` nie istnieje w kontenerze `mcraft-mongo-1` (blad "command not found") - potrzebny fallback na legacy `mongo` shell (inna skladnia, bez async/await).
