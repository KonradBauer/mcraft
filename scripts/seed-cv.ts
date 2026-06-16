import { getPayload } from 'payload'
import config from '../src/payload.config.js'

async function seedCv() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'cv-modal',
    data: {
      experience: [
        { year: '2022r. - do dziś', description: 'Główny Spawalnik', company: 'ZUGIL S.A.' },
        { year: '2025r. - do dziś', description: 'Kierownik projektu B+R', company: 'Numer wniosku o dofinansowanie: FENG.01.01-IP.01-A0QL/24' },
        { year: '2021r. - do dziś', description: 'Właściciel firmy', company: 'MCRAFT Michał Macherzyński' },
        { year: '2019r. - 2023r.', description: 'Kluczowy personel w projekcie B+R', company: 'Numer wniosku o dofinansowanie: POIR.01.01.01-00-0779/18' },
        { year: '2016r. - 2022r.', description: 'Technolog Spawalnik', company: 'ZUGIL S.A.' },
        { year: '2016r. - 2020r.', description: 'Wykładowca', company: 'Szkolenia spawaczy organizowane przez Wojewódzki Uniwersytet Robotniczy Sp. z o.o.' },
      ],
      qualifications: [
        { code: 'IWE', description: 'Międzynarodowy Inżynier Spawalnik' },
        { code: 'IWI', description: 'Międzynarodowy Inspektor Spawalniczy' },
        { code: 'VT2', description: 'Certyfikat kompetencji II stopnia zgodny z PN-EN ISO 9712, Instytut spawalnictwa w Gliwicach' },
        { code: 'PT2', description: 'Certyfikat kompetencji II stopnia zgodny z PN-EN ISO 9712, Instytut spawalnictwa w Gliwicach' },
      ],
      education: [
        { year: '2017r. - 2022r.', institution: 'Politechnika Częstochowska', description: 'Wydział Inżynierii Mechanicznej i Informatyki, Budowa i Eksploatacja Maszyn, III stopień' },
        { year: '2021r.', institution: 'Sieć Badawcza Łukasiewicz - Instytut Spawalnictwa', description: 'Kurs Międzynarodowego Inspektora Spawalniczego IWI-C' },
        { year: '08.2019r.', institution: 'Wärtsilä Finland Oy', description: 'Staż naukowy' },
        { year: '2016r. - 2018r.', institution: 'Politechnika Częstochowska', description: 'Studium Kształcenia i Doskonalenia Nauczycieli, Fakultatywne Studia Pedagogiczne' },
        { year: '2017r. - 2018r.', institution: 'Politechnika Częstochowska', description: 'Zakład Spawalnictwa, Wymagania i Kompetencje Międzynarodowego Inżyniera Spawalnika (IWE)' },
        { year: '2012r. - 2017r.', institution: 'Politechnika Częstochowska', description: 'Wydział Inżynierii Mechanicznej i Informatyki, Mechanika i Budowa Maszyn, Spawalnictwo, I i II stopień, tryb stacjonarny' },
        { year: '2008r. - 2012r.', institution: 'Zespół Szkół nr 1 w Kłobucku', description: 'Technikum Mechaniczne, Obróbka Skrawaniem' },
      ],
      additionalQualifications: [
        { year: '09.2014r.', description: 'Kurs KPP - uzyskanie tytułu Ratownika' },
        { year: '03.2014r.', description: 'Kurs Autoryzowanego Centrum Szkoleniowego Autodesk - AutoCAD zaawansowany' },
        { year: '11.2010r.', description: 'Prawo jazdy kategorii: A, B' },
      ],
      skills: 'Obsługa: Autodesk Inventor Professional 3D, Autodesk AutoCAD, Siemens PLM Software Solid Edge 2D Drafting, Dassault Systemes Solid Works, Microsoft Office: Word, Excel, PowerPoint\n\nSpawanie: MMA (111), MIG (131), MAG (135, 136, 138), TIG (141)\n\nDodatkowo: Znajomość rysunku technicznego, zarządzanie zespołem, praca zespołowa, rozwiązywanie problemów technicznych, bardzo dobra organizacja pracy',
      interests: 'Sport, motoryzacja, podróże',
    },
  })

  console.log('CV seeded.')
  process.exit(0)
}

seedCv().catch((err) => {
  console.error(err)
  process.exit(1)
})
