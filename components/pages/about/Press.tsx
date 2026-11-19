import SectionScript from '@/components/pages/SectionScript';
import './press.css';

export default function Press() {
  return (
    <>
      <SectionScript id="snlg-template--23876058808423__press" name="press" />
      <section
        id="snlg-template--23876058808423__press"
        className="sn-s snlg snlg--press"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '60px', '--pb': '60px' }}
      >
        <div className="sn-wrap">
          <div className="sn-head sn-head--center ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
                </svg>
                {' As featured in'}
              </p>
            </div>
          </div>
          <div className="snlg__press" data-snlg="">
            <div className="snlg__quotes">
              <blockquote className="snlg__q sn-h sn-h--m is-on" data-snlg-q="0">
                “The bed sheets that made Lahore fall back in love with sleep.”
              </blockquote>
              <blockquote className="snlg__q sn-h sn-h--m" data-snlg-q="1">
                “Hotel-grade sateen at a price that finally makes sense.”
              </blockquote>
              <blockquote className="snlg__q sn-h sn-h--m" data-snlg-q="2">
                “A quiet luxury brand with an obsession for detail.”
              </blockquote>
              <blockquote className="snlg__q sn-h sn-h--m" data-snlg-q="3">
                “Their T300 set is the softest we tested this year.”
              </blockquote>
              <blockquote className="snlg__q sn-h sn-h--m" data-snlg-q="4">
                “Beautiful colours, honest fabrics and fast delivery.”
              </blockquote>
            </div>
            <div className="snlg__tabs" role="tablist">
              <button type="button" className="snlg__logo is-on" data-snlg-t="0" aria-label="Dawn Lifestyle">
                <span>Dawn Lifestyle</span>
                <i className="snlg__bar" />
              </button>
              <button type="button" className="snlg__logo" data-snlg-t="1" aria-label="Home & Living">
                <span>Home & Living</span>
                <i className="snlg__bar" />
              </button>
              <button type="button" className="snlg__logo" data-snlg-t="2" aria-label="The Weekend Edit">
                <span>The Weekend Edit</span>
                <i className="snlg__bar" />
              </button>
              <button type="button" className="snlg__logo" data-snlg-t="3" aria-label="Sleep Journal">
                <span>Sleep Journal</span>
                <i className="snlg__bar" />
              </button>
              <button type="button" className="snlg__logo" data-snlg-t="4" aria-label="Décor Daily">
                <span>Décor Daily</span>
                <i className="snlg__bar" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
