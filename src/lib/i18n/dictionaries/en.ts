import type { Dictionary } from './pl'

export const en = {
  nav: {
    about: 'About',
    areas: 'Areas',
    realizations: 'Projects',
    contact: 'Contact',
  },
  mobileNav: {
    openMenuAria: 'Open menu',
    closeMenuAria: 'Close menu',
    menuLabelAria: 'Navigation menu',
    linkedin: 'LinkedIn',
  },
  hero: {
    eyebrow: 'PhD Eng.',
    ctaMoreInfo: 'Find out more',
    fallbackSubtitle: 'Welding engineer\nIWE / IWI / VT2 / PT2',
  },
  about: {
    eyebrow: 'Who am I?',
    moreAboutMe: '...more about me',
    fallbackBio:
      'Head Welder and R&D Project Manager at ZUGIL S.A. Involved in welding and steel structures for over 18 years. Short introduction, experience and values - full description will be loaded from resources.',
    portraitPlaceholder: 'Photo - Who am I',
  },
  tiles: {
    seeAllAria: 'See all figures',
    emptyState: 'Add stat tiles in the admin panel',
  },
  areas: {
    eyebrow: 'What I offer',
    title: 'Areas of activity',
    seeMore: 'See more',
    names: {
      nadzorSpawalniczy: 'Welding supervision',
      konstrukcjeStalowe: 'Steel structures',
      meblePremium: 'Premium furniture',
    },
  },
  footer: {
    eyebrow: 'Let\'s talk about your project',
    title: 'Get in touch',
    mapsTitle: 'MCRAFT location',
    copyright: (year: number) => `© ${year} MCRAFT Michał Macherzyński. All rights reserved.`,
    privacyPolicy: 'Privacy policy',
    builtBy: 'Built by:',
  },
  subpage: {
    scopeTitle: 'Scope',
    realizationsTitle: 'Projects',
    ctaDefault: 'Interested in working together?',
    ctaButton: 'Get in touch',
  },
  realizacjaPage: {
    eyebrow: 'Project',
    noDescription: 'No project description.',
    ctaSimilarProject: 'Interested in a similar project?',
  },
  gallery: {
    noPhotos: 'No photos',
    zoomAria: (alt: string) => `Zoom: ${alt}`,
    closeGalleryAria: 'Close gallery',
    prevPhotoAria: 'Previous photo',
    nextPhotoAria: 'Next photo',
    photoAria: (index: number) => `Photo ${index}`,
  },
  modal: {
    closeAria: 'Close',
    cv: {
      eyebrow: 'Find out more',
      title: 'PhD Eng. Michał Macherzyński',
      sub: 'Professional CV - experience and qualifications',
      downloadLabel: 'Download CV (PDF)',
      sections: {
        experience: 'Professional experience',
        qualifications: 'Qualifications',
        education: 'Education',
        additionalQualifications: 'Additional qualifications',
        skills: 'Skills',
        interests: 'Interests and hobbies',
      },
    },
    bio: {
      eyebrow: 'More about me',
      title: 'Michał Macherzyński',
      sub: 'Biography - path and passion',
    },
    tiles: {
      title: 'Experience and qualifications',
    },
    scope: {
      eyebrow: 'Scope of services',
    },
  },
  notFound: {
    metaTitle: '404 - Page not found | MCRAFT',
    eyebrow: 'Navigation error',
    title: 'Page does not exist',
    description: 'The address you entered is invalid or the page has been moved.',
    backHome: 'Back to homepage',
    footer: 'MCRAFT - PhD Eng. Michał Macherzyński',
  },
} satisfies Dictionary
