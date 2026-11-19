import SectionScript from '@/components/pages/SectionScript';
import './favorites/main.css';

const ID = 'snpg-template--23876059005031__main';

/** The theme's page template body (`snpg`): rich text, with a sticky table of contents when the page has 2+ headings. */
export default function PageBody({ html, children }: { html?: string; children?: React.ReactNode }) {
  const toc = !!html && (html.match(/<h[23][\s>]/g) || []).length >= 2;
  return (
    <>
      {toc ? <SectionScript id={ID} name="toc" /> : null}
      <section id={ID} className={`sn-s snpg ${toc ? 'snpg--toc' : 'snpg--simple'}`} style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '80px', '--pb': '100px' }}>
        <div className="sn-wrap snpg__wrap" style={toc ? { maxWidth: 1180 } : undefined}>
          {toc ? (
            <div className="snpg__grid">
              <aside className="snpg__toc" data-snpg-toc="" hidden>
                <p>On this page</p>
                <ol />
              </aside>
              <div className="sn-rte snpg__body" data-snpg-body="" dangerouslySetInnerHTML={{ __html: html! }} />
            </div>
          ) : html ? (
            <div className="sn-rte snpg__body" data-r="" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <div className="sn-rte snpg__body" data-r="">
              {children}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
