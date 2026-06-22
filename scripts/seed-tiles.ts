import 'dotenv/config'
import { getPayload } from 'payload'
import type { StatTile } from '../src/payload-types.js'
import config from '../src/payload.config.js'

type TileIcon = NonNullable<StatTile['icon']>

const tiles: Array<{ number: string; icon: TileIcon; label: string; description: string; order: number }> = [
  { number: '18+',      icon: 'Clock',          label: 'lat praktyki w spawaniu',                    description: 'Wykonanie pierwszej spoiny w 2008 roku metodą 111, spawanie metodą 135 od 2012 roku.',                                                                                      order: 1  },
  { number: '10+',      icon: 'ClipboardList',   label: 'lat doświadczenia w nadzorze',               description: 'Praca w przemyśle, nadzorowanie wykonywania konstrukcji stalowych zgodnych z EN 1090 / EN 15085 / ISO 3834.',                                                               order: 2  },
  { number: '5+',       icon: 'TrendingUp',      label: 'lat budowy własnej marki',                   description: 'Założenie firmy MCraft w 2021 roku.',                                                                                                                                         order: 3  },
  { number: '550+',     icon: 'Warehouse',       label: 'm² powierzchni produkcyjno-magazynowej',     description: '220 m² powierzchni z suwnicą 1t, 250 m² dodatkowej powierzchni produkcyjnej, 100 m² powierzchni magazynowej.',                                                               order: 4  },
  { number: '500+',     icon: 'Users',           label: 'przeegzaminowanych spawaczy',                description: 'Egzaminowanie spawaczy w ramach współpracy z jednostkami notyfikowanymi oraz w ramach utrzymania uprawnień pracowników pracodawcy.',                                          order: 5  },
  { number: '111',      icon: 'Zap',             label: 'spawanie MMA (SMAW)',                        description: 'Spawanie stali konstrukcyjnych.',                                                                                                                                             order: 6  },
  { number: '131',      icon: 'Zap',             label: 'spawanie MIG (GMAW)',                        description: 'Spawanie aluminium.',                                                                                                                                                         order: 7  },
  { number: '135',      icon: 'Zap',             label: 'spawanie MAG (GMAW)',                        description: 'Spawanie stali konstrukcyjnych oraz wysokostopowych.',                                                                                                                        order: 8  },
  { number: '136/138',  icon: 'Zap',             label: 'spawanie FCAW',                              description: 'Spawanie stali konstrukcyjnych oraz wysokostopowych.',                                                                                                                        order: 9  },
  { number: '141',      icon: 'Flame',           label: 'spawanie TIG (GTAW)',                        description: 'Spawanie stali konstrukcyjnych, wysokostopowych oraz aluminium.',                                                                                                             order: 10 },
  { number: 'IWE',      icon: 'GraduationCap',   label: 'International Welding Engineer',             description: 'Dyplom Międzynarodowego Inżyniera Spawalnika od 2018 roku nr PL/IWE/2525/2018.',                                                                                             order: 11 },
  { number: 'IWI',      icon: 'Search',          label: 'International Welding Inspector',            description: 'Dyplom Międzynarodowego Inspektora Spawalnika od 2021 roku nr PL/IWI-C/880/2021 Comprehensive Level.',                                                                       order: 12 },
  { number: 'VT2',      icon: 'Eye',             label: 'badania wizualne spoin',                     description: 'Certyfikat kompetencji od 2015 roku nr VT2/10029/2025/2.',                                                                                                                   order: 13 },
  { number: 'PT2',      icon: 'Droplets',        label: 'badania penetracyjne spoin',                 description: 'Certyfikat kompetencji od 2017 roku nr PT2/12620/2022/1.',                                                                                                                   order: 14 },
  { number: 'WPS',      icon: 'FileText',        label: 'instrukcje spawania',                        description: 'Opracowywanie instrukcji technologicznych spawania zgodnie z serią norm PN-EN ISO 15614.',                                                                                   order: 15 },
  { number: 'WPQR',     icon: 'ClipboardCheck',  label: 'kwalifikowanie technologii',                 description: 'Kwalifikowanie technologii spawania zgodnie z serią norm PN-EN ISO 15614.',                                                                                                  order: 16 },
  { number: 'ISO 3834', icon: 'ShieldCheck',     label: 'system jakości spawania',                    description: 'Nadzór nad spełnieniem wymagań serii norm PN-EN ISO 3834-2.',                                                                                                                order: 17 },
  { number: 'EN 1090',  icon: 'Layers',          label: 'konstrukcje stalowe',                        description: 'Nadzór nad spełnieniem wymagań serii norm PN-EN 1090.',                                                                                                                      order: 18 },
  { number: 'EN 15085', icon: 'Train',           label: 'pojazdy szynowe',                            description: 'Nadzór nad spełnieniem wymagań serii norm PN-EN 15085, personel poziomu 1.',                                                                                                 order: 19 },
  { number: 'ISO 9606', icon: 'UserCheck',       label: 'egzaminowanie spawaczy',                     description: 'Egzaminator spawaczy w zakresie serii norm PN-EN ISO 9606.',                                                                                                                 order: 20 },
  { number: 'ISO 14732',icon: 'Settings2',       label: 'egzaminowanie operatorów',                   description: 'Egzaminator operatorów i nastawiaczy w zakresie normy PN-EN ISO 14732.',                                                                                                     order: 21 },
  { number: 'ISO 14731',icon: 'Briefcase',       label: 'nadzorowanie spawania',                      description: 'Personel o pełnej wiedzy technicznej.',                                                                                                                                       order: 22 },
  { number: 'B1',       icon: 'Globe',           label: 'język angielski',                            description: 'Znajomość języka angielskiego na komunikatywnym poziomie B1.',                                                                                                               order: 23 },
  { number: 'B+R',      icon: 'FlaskConical',    label: 'koordynacja i nadzór',                       description: 'Kierownik projektu badawczo-rozwojowego.',                                                                                                                                   order: 24 },
  { number: '2D',       icon: 'PenTool',         label: 'rysowanie w AutoCAD',                        description: 'Wykonywanie rysunków technicznych.',                                                                                                                                          order: 25 },
  { number: '3D',       icon: 'Box',             label: 'projektowanie w Inventor',                   description: 'Wykonywanie nieskomplikowanych projektów elementów i złożeń 3D.',                                                                                                            order: 26 },
]

async function seedTiles(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'stat-tiles', limit: 0 })
  if (existing.totalDocs > 0) {
    console.log(`Usuwam ${existing.totalDocs} istniejących kafelków...`)
    await payload.delete({
      collection: 'stat-tiles',
      where: { id: { exists: true } },
    })
  }

  console.log(`Dodaję ${tiles.length} kafelków...`)
  for (const tile of tiles) {
    await payload.create({ collection: 'stat-tiles', data: tile })
  }
  console.log('Gotowe.')
  process.exit(0)
}

seedTiles().catch((err) => {
  console.error(err)
  process.exit(1)
})
