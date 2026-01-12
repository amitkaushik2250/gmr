export default function decorate(block) {
  const rows = [...block.children];

  // Extract elements safely (in case there are fewer rows)
  const titleEl = rows[0];
  const descEl = rows[1];
  const marketTitleEl = rows[2];
  const marketDateEl = rows[3];
  const marketContentEl = rows[4];
  const ctaTextEl = rows[5];
  const ctaLinkEl = rows[6];

  // Stat cards start from row 7 onwards (up to 6 stats)
  const statEls = rows.slice(7, 13); // rows[7] to rows[12] → max 6 stats

  const data = {
    title: titleEl?.textContent?.trim() || 'Investor Relations',
    description: descEl?.innerHTML?.trim() || '',
    marketTitle: marketTitleEl?.textContent?.trim() || '',
    marketDate: marketDateEl?.textContent?.trim() || '',
    marketContent: marketContentEl?.innerHTML?.trim() || '',
    ctaText: ctaTextEl?.textContent?.trim() || '',
    ctaLink: ctaLinkEl?.textContent?.trim() || '#',
    stats: statEls
      .map(el => el?.innerHTML?.trim())
      .filter(Boolean) // remove empty or undefined
  };

  // Clear the block
  block.innerHTML = '';

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'gal-investor-wrapper';

  wrapper.innerHTML = `
    <div class="gal-left">
      <h2>${data.title}</h2>
      
      ${data.description ? `<div class="gal-desc">${data.description}</div>` : ''}

      <div class="gal-market">
        <div class="market-header">
          <span class="market-title">${data.marketTitle}</span>
          <span class="market-date">${data.marketDate}</span>
        </div>
        ${data.marketContent ? `<div class="market-body">${data.marketContent}</div>` : ''}
      </div>

      ${data.ctaText ? `<a class="gal-cta" href="${data.ctaLink}">${data.ctaText}</a>` : ''}
    </div>

    <div class="gal-right">
      ${data.stats
        .map(stat => `
          <div class="gal-stat-card">
            ${stat}
          </div>
        `)
        .join('')}
      
      <!-- Optional: Show empty placeholders if fewer than 6 stats are provided -->
      ${Array(Math.max(0, 6 - data.stats.length))
        .fill('')
        .map(() => `<div class="gal-stat-card gal-stat-placeholder"></div>`)
        .join('')}
    </div>
  `;

  block.append(wrapper);
}




