import Link from 'next/link';
import type { Blog } from '@/lib/shopify/content';
import { img, srcset } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import './main.css';

const readMins = (s: string) => Math.max(1, Math.round(s.split(/\s+/).length / 200));

/** The theme's blog template (`snbl`). Live "News" is empty, so the empty state matches the theme. */
export default function BlogMain({ blog }: { blog: Blog }) {
  return (
    <section
      id="snbl-template--23876058710119__main"
      className="sn-s snbl"
      style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '112px' }}
    >
      <div className="sn-wrap">
        <div className="snbl__head">
          <div>
            <p className="sn-eyebrow">
              <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.3" />
                <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
              </svg>
              {' The Sakooon journal'}
            </p>
            <h1 className="sn-h sn-h--xl">
              {`${blog.title} `}
              <em>& slow mornings</em>
            </h1>
          </div>
        </div>
        <div className="snbl__grid">
          {blog.articles.length ? (
            blog.articles.map((a, i) => {
              const url = `/blogs/${blog.handle}/${a.handle}`;
              const d = new Date(a.publishedAt);
              return (
                <article key={a.handle} className={`snbl__post${i === 0 ? ' is-lead' : ''}`} data-r="" style={{ '--i': i % 3 }}>
                  <Link className="snbl__img" href={url} aria-label={a.title}>
                    <div className="sn-media snbl__m">
                      {a.image ? (
                        <img
                          src={img(a.image.url, 900)}
                          srcSet={srcset(a.image.url, [500, 900, 1400])}
                          sizes={i === 0 ? '(min-width: 990px) 55vw, 100vw' : '(min-width: 990px) 33vw, 100vw'}
                          alt={a.image.altText || a.title}
                          width={a.image.width || 1200}
                          height={a.image.height || 900}
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                      ) : null}
                    </div>
                    <span className="snbl__date">
                      <b>{d.getUTCDate()}</b>
                      {d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })}
                    </span>
                  </Link>
                  <div className="snbl__body">
                    <p className="snbl__meta">
                      {a.author ? <span>{a.author}</span> : null}
                      <span>
                        <Icon name="info" />
                        {readMins(a.excerpt)} min read
                      </span>
                    </p>
                    <h2 className={`sn-h ${i === 0 ? 'sn-h--l' : 'sn-h--s'}`}>
                      <Link href={url}>{a.title}</Link>
                    </h2>
                    {a.excerpt ? <p className="snbl__ex">{a.excerpt}</p> : null}
                    <Link className="sn-link" href={url}>
                      Read the story
                      <Icon name="arrow" />
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="sn-empty">
              <p className="sn-h sn-h--m">New stories are being written.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
