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

# Migracja portfolio-projects -> service-pages.realizacje

Przenosi realizacje MK Gym z osobnej kolekcji `portfolio-projects` do zagniezdzonego pola
`realizacje` w `service-pages` (potrzebne zeby dzialalo natywne Collapse All + drag-drop
w adminie). TYLKO mk-gym - meble-premium i konstrukcje-stalowe zostaja na starej kolekcji.
Port `scripts/migrate-portfolio-to-realizacje.ts` + `src/lib/portfolioToRealizacje.ts`.

**Od `afterChange`/`afterDelete` hooka na `Portfolio` (src/collections/Portfolio.ts) kazdy
zapis/usuniecie realizacji MK Gym w adminie synchronizuje sie automatycznie** - ten blok
mongosh ponizej jest juz tylko awaryjny (np. recznie zmieniony dokument bezposrednio w
Mongo, albo drugi resync po edycji poza appka).

Niedestrukcyjna - stara kolekcja `portfolio-projects` NIE jest kasowana, tylko kopiowana.
Idempotentna - bezpieczna do wielokrotnego odpalenia (za kazdym razem nadpisuje `realizacje`
od nowa na podstawie aktualnego stanu `portfolio-projects`).

Odpal w SSH na VPS (`root@vmi2959994`) PO wdrozeniu tego brancha na produkcje, PRZED
przelaczeniem ruchu na nowy kod frontendu (frontend czyta juz tylko z `service-pages.realizacje`):

```bash
docker exec -i mcraft-mongo-1 mongosh mcraft <<'EOF'
(async function () {
  const PORTFOLIO_SERVICE_SLUGS = ['mk-gym'];

  function toRealizacjaRow(portfolioDoc) {
    return {
      id: new ObjectId().toHexString(),
      title: portfolioDoc.title ?? null,
      slug: portfolioDoc.slug ?? '',
      description: portfolioDoc.description ?? null,
      thumbnail: portfolioDoc.thumbnail ?? null,
      images: portfolioDoc.images ?? [],
      additionalGalleries: portfolioDoc.additionalGalleries ?? [],
    };
  }

  function sortByOrder(docs) {
    return [...docs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  for (const slug of PORTFOLIO_SERVICE_SLUGS) {
    const servicePageDoc = await db.getCollection('service-pages').findOne({ slug });
    if (!servicePageDoc) {
      print('  ' + slug + ': brak dokumentu service-pages, pomijam');
      continue;
    }

    const portfolioDocs = await db.getCollection('portfolio-projects')
      .find({ servicePage: servicePageDoc._id })
      .toArray();

    const realizacje = sortByOrder(portfolioDocs).map(toRealizacjaRow);

    await db.getCollection('service-pages').updateOne(
      { _id: servicePageDoc._id },
      { $set: { realizacje } },
    );
    print('  ' + slug + ': ' + realizacje.length + ' realizacji zmigrowanych');
  }

  print('Migracja portfolio-projects -> service-pages.realizacje zakonczona.');
  print('Stara kolekcja portfolio-projects NIE zostala usunieta (recznie w kolejnym kroku).');
})()
EOF
```

Weryfikacja po migracji (sprawdz ze liczba realizacji sie zgadza):

```javascript
db.getCollection('portfolio-projects').countDocuments()
db.getCollection('service-pages').find({}, { slug: 1, 'realizacje.title': 1 }).toArray()
```
