'use client';

import { useSection } from '@/components/theme/useSection';
import { money } from '@/lib/utils';

type Pick = { i: number; id: number; price: number; cmp: number; img: string | null; title: string | null };

const POS = [['-22%', '-8%', '-9deg'], ['18%', '-14%', '7deg'], ['-12%', '16%', '4deg'], ['20%', '14%', '-6deg'], ['0%', '0%', '2deg'], ['-26%', '22%', '-3deg']];

/** Port of the "Build your dream set" section script. */
export default function BuilderBehavior({ id }: { id: string }) {
  useSection(id, (r, signal) => {
    const steps = Array.from(r.querySelectorAll<HTMLElement>('[data-snsb-step]'));
    const stack = r.querySelector<HTMLElement>('[data-snsb-stack]')!;
    const add = r.querySelector<HTMLButtonElement>('[data-snsb-add]')!;
    const disc = parseFloat(r.getAttribute('data-discount') || '') || 0;

    steps.forEach((st) =>
      st.querySelector('[data-snsb-toggle]')!.addEventListener('click', () => {
        const o = st.classList.contains('is-open');
        steps.forEach((x) => x.classList.remove('is-open'));
        if (!o) st.classList.add('is-open');
      }, { signal }),
    );

    const chosen = (): Pick[] => {
      const out: Pick[] = [];
      steps.forEach((st, i) => {
        const inp = st.querySelector<HTMLInputElement>('input:checked');
        if (!inp || !inp.value) return;
        const vs = inp.closest('.snsb__opt')!.querySelector<HTMLSelectElement>('[data-snsb-vs]');
        let vid = inp.value, pr = +inp.getAttribute('data-price')!, cm = +inp.getAttribute('data-cmp')!;
        if (vs) {
          const o = vs.options[vs.selectedIndex];
          vid = o.value; pr = +o.getAttribute('data-price')!; cm = +o.getAttribute('data-cmp')!;
        }
        out.push({ i, id: +vid, price: pr, cmp: cm, img: inp.getAttribute('data-img'), title: inp.getAttribute('data-title') });
      });
      return out;
    };

    const paint = (changed?: number) => {
      const c = chosen();
      let tot = 0, cmp = 0;
      c.forEach((x) => { tot += x.price; cmp += Math.max(x.cmp, x.price); });
      const fin = disc > 0 && c.length > 1 ? Math.round(tot * (1 - disc / 100)) : tot;
      r.querySelector('[data-snsb-n]')!.textContent = String(c.length);
      r.querySelector('[data-snsb-total]')!.textContent = money(fin);
      const was = r.querySelector<HTMLElement>('[data-snsb-was]');
      if (was) { was.hidden = !(cmp > fin && c.length); was.textContent = money(cmp); }
      const sv = r.querySelector<HTMLElement>('[data-snsb-save]');
      if (sv) sv.hidden = !(disc > 0 && c.length > 1);
      let ok = c.length > 0;
      steps.forEach((st) => {
        const inp = st.querySelector<HTMLInputElement>('input:checked');
        const done = !!(inp && inp.value);
        st.classList.toggle('is-done', done);
        if (st.getAttribute('data-req') === 'true' && !done) ok = false;
        const lbl = st.querySelector('[data-snsb-picked]');
        if (done && lbl) lbl.textContent = inp!.getAttribute('data-title');
      });
      add.disabled = !ok;
      if (changed != null) {
        stack.querySelectorAll(`.snsb__layer[data-i="${changed}"]`).forEach((l) => l.remove());
        const it = c.find((x) => x.i === changed);
        if (it) {
          const p = POS[changed % POS.length], d = document.createElement('div');
          d.className = 'snsb__layer';
          d.setAttribute('data-i', String(changed));
          d.style.cssText = `--tx:${p[0]};--ty:${p[1]};--rot:${p[2]};z-index:${changed + 1}`;
          if (it.img) { const im = document.createElement('img'); im.src = it.img; im.alt = ''; d.appendChild(im); }
          else d.style.background = 'linear-gradient(160deg,var(--card),var(--card2))';
          stack.appendChild(d);
        }
        stack.classList.toggle('has-items', c.length > 0);
      }
    };

    steps.forEach((st, i) =>
      st.addEventListener('change', (e) => {
        paint(i);
        const t = e.target as HTMLInputElement;
        if (t.type === 'radio' && t.value)
          setTimeout(() => {
            const nx = steps[i + 1];
            if (nx && !nx.classList.contains('is-done')) { st.classList.remove('is-open'); nx.classList.add('is-open'); }
          }, 350);
      }, { signal }),
    );
    const onAdd = () => {
      const items = chosen().map((x) => ({ id: x.id, quantity: 1 }));
      if (!items.length) return;
      add.classList.add('is-busy');
      window.SN.cart.add(items).catch(() => {}).then(() => add.classList.remove('is-busy'));
    };
    add.addEventListener('click', onAdd, { signal });
    steps.forEach((st, i) => { const inp = st.querySelector<HTMLInputElement>('input:checked'); if (inp?.value) paint(i); });
    paint();
    return () => {
      stack.querySelectorAll('.snsb__layer').forEach((l) => l.remove());
    };
  });
  return null;
}
