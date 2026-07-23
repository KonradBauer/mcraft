const heading = 'font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3'

export function PolitykaPrywatnosciContentEn() {
  return (
    <>
      <h1 className="font-light text-[38px] uppercase tracking-[0.01em] text-dark-text mb-4">
        Privacy Policy
      </h1>
      <div className="w-16 h-0.5 bg-accent mb-10" />

      <div className="prose max-w-none text-[15px] leading-[1.85] text-[#56544e] space-y-6">
        <section>
          <h2 className={heading}>1. Data Controller</h2>
          <p>The data controller is MCRAFT Michał Macherzyński, NIP: 5742046939, ul. Żołnierzy Września 36, 42-152 Wilkowiecko, Poland. Contact: kontakt@poczta-mcraft.pl, tel. +48 601-488-318.</p>
        </section>

        <section>
          <h2 className={heading}>2. Data collected via the contact form</h2>
          <p>The site does not have a contact form. Contact is made by phone or email listed in the site footer. Data provided in an email message or phone call is processed solely to respond and carry out the request.</p>
        </section>

        <section>
          <h2 className={heading}>3. Cookies</h2>
          <p>The site may use technical cookies necessary for the site to function properly. We do not use analytical or marketing cookies without your consent.</p>
        </section>

        <section>
          <h2 className={heading}>4. User rights</h2>
          <p>Under GDPR (EU Regulation 2016/679) you have the right to: access your data, rectify it, erase it, restrict processing, data portability, and object to processing. To exercise these rights, contact the data controller.</p>
        </section>

        <section>
          <h2 className={heading}>5. Third-party services</h2>
          <p>The site uses Google Maps (map in the footer), subject to Google LLC&apos;s separate privacy policy. The site contains a link to a LinkedIn profile.</p>
        </section>

        <section>
          <h2 className={heading}>6. Policy changes</h2>
          <p>The data controller reserves the right to change this policy. Last updated: 2026-06-18.</p>
        </section>
      </div>
    </>
  )
}
