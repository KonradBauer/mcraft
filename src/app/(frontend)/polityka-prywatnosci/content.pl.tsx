const heading = 'font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3'

export function PolitykaPrywatnosciContentPl() {
  return (
    <>
      <h1 className="font-light text-[38px] uppercase tracking-[0.01em] text-dark-text mb-4">
        Polityka prywatności
      </h1>
      <div className="w-16 h-0.5 bg-accent mb-10" />

      <div className="prose max-w-none text-[15px] leading-[1.85] text-[#56544e] space-y-6">
        <section>
          <h2 className={heading}>1. Administrator danych</h2>
          <p>Administratorem danych osobowych jest MCRAFT Michał Macherzyński, NIP: 5742046939, ul. Żołnierzy Września 36, 42-152 Wilkowiecko. Kontakt: kontakt@poczta-mcraft.pl, tel. +48 601-488-318.</p>
        </section>

        <section>
          <h2 className={heading}>2. Dane zbierane przez formularz kontaktowy</h2>
          <p>Serwis nie posiada formularza kontaktowego. Kontakt odbywa się przez telefon lub e-mail podany w stopce strony. Dane przekazane w wiadomości e-mail lub rozmowie telefonicznej przetwarzane są wyłącznie w celu udzielenia odpowiedzi i realizacji zlecenia.</p>
        </section>

        <section>
          <h2 className={heading}>3. Pliki cookies</h2>
          <p>Serwis może używać technicznych plików cookies niezbędnych do prawidłowego działania strony. Nie używamy cookies analitycznych ani marketingowych bez Twojej zgody.</p>
        </section>

        <section>
          <h2 className={heading}>4. Prawa użytkownika</h2>
          <p>Na podstawie RODO (Rozporządzenie UE 2016/679) przysługuje Ci prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu. W celu realizacji tych praw skontaktuj się z administratorem.</p>
        </section>

        <section>
          <h2 className={heading}>5. Zewnętrzne serwisy</h2>
          <p>Strona korzysta z Google Maps (mapa w stopce) - podlegającego osobnej polityce prywatności Google LLC. Strona zawiera link do profilu LinkedIn.</p>
        </section>

        <section>
          <h2 className={heading}>6. Zmiany polityki</h2>
          <p>Administrator zastrzega sobie prawo do zmian niniejszej polityki. Data ostatniej aktualizacji: 2026-06-18.</p>
        </section>
      </div>
    </>
  )
}

export const politykaPrywatnosciPlText = {
  backHome: '- Wróć na stronę główną',
  copyrightSuffix: 'MCRAFT Michał Macherzyński. Wszystkie prawa zastrzeżone.',
}
