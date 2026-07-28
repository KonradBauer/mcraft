'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { BioModal } from '@/payload-types'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'
import { ModalBodySection, ModalHead } from './ModalShared'

export function ModalBio({ bioModal, dict }: { bioModal: BioModal; dict: Dictionary }) {
  const sectionsWithContent = (bioModal.sections ?? []).filter(
    (s): s is typeof s & { title: string; content: NonNullable<typeof s.content> } => Boolean(s.title) && Boolean(s.content),
  )
  const hasData = sectionsWithContent.length > 0
  return (
    <>
      <ModalHead eyebrowText={dict.modal.bio.eyebrow} title={dict.modal.bio.title} sub={dict.modal.bio.sub} />
      <div className="px-12 pt-4 pb-4 max-[980px]:px-7">
        {hasData ? (
          sectionsWithContent.map((section) => (
            <ModalBodySection key={section.id ?? section.title} title={section.title}>
              <div className="prose-mcraft">
                <RichText data={section.content} />
              </div>
            </ModalBodySection>
          ))
        ) : (
          <>
            <ModalBodySection title="Moja droga">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Tu znajdzie się bardziej osobista opowieść - życiorys, początki fascynacji metalem i spawaniem, droga od warsztatu do tytułu doktora inżyniera. Treść zostanie przygotowana i wczytana z zasobów.</p>
            </ModalBodySection>
            <ModalBodySection title="Pasja">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Poza pracą zawodową - tworzenie unikalnych mebli stalowych, projekty autorskie i ciągłe doskonalenie rzemiosła. To miejsce na prywatną, mniej formalną część historii.</p>
            </ModalBodySection>
            <ModalBodySection title="Wartości">
              <p className="text-[13.5px] leading-[1.65] text-[#56544e]">Jakość jako standard, a nie cel. Rzetelność, dbałość o detal i partnerskie podejście do każdego projektu.</p>
            </ModalBodySection>
          </>
        )}
      </div>
    </>
  )
}
