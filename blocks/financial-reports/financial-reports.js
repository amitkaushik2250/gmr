export default function decorate(block) {
    const rows = [...block.children];
  
    if (rows.length === 0) {
      block.innerHTML = '<p>No content configured.</p>';
      return;
    }
  
    // ---- First row: Configuration ----
    const configCells = [...rows[0].children];
  
    const sectionTitle = (configCells[0]?.textContent || '').trim() || 'Financial Reports';
  
    // Robust description extraction
    let sectionDescriptionHTML = '';
    if (configCells[1]) {
      // Clone the entire cell content to preserve formatting (p, strong, br, a, etc.)
      const descCell = configCells[1];
      // Remove any nested tables or unwanted elements if needed (optional)
      sectionDescriptionHTML = descCell.innerHTML.trim();
    }
  
    const tab1Text = (configCells[2]?.textContent || '').trim() || 'GMR Airports Limited';
    const tab2Text = (configCells[3]?.textContent || '').trim() || 'GMR Power & Urban Infra Ltd.';
    const ctaText = (configCells[4]?.textContent || '').trim() || 'View All Reports';
    const ctaLink = (configCells[5]?.textContent || '').trim() || '#';
  
    // ---- Collect cards by company ----
    const companyCards = { airport: [], infra: [] };
  
    for (let i = 1; i < rows.length; i++) {
      const cells = [...rows[i].children];
      if (cells.length === 0) continue;
  
      const companyRaw = (cells[0]?.textContent || '').trim().toLowerCase();
      const company = companyRaw.includes('infra') || companyRaw.includes('power') || companyRaw.includes('urban')
        ? 'infra'
        : 'airport';
  
      // Extract up to 3 cards
      for (let j = 0; j < 3; j++) {
        const title = (cells[1 + j * 2]?.textContent || '').trim();
        const link = (cells[2 + j * 2]?.textContent || '').trim() || '#';
  
        if (title) {
          companyCards[company].push({ title, link });
        }
      }
    }
  
    // Deduplicate
    const dedupe = (arr) => {
      const seen = new Set();
      return arr.filter(item => {
        const key = `${item.title}|${item.link}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
  
    companyCards.airport = dedupe(companyCards.airport);
    companyCards.infra = dedupe(companyCards.infra);
  
    // ---- Render HTML ----
    block.innerHTML = `
      <div class="financial-wrapper">
        <h2>${sectionTitle}</h2>
  
        ${sectionDescriptionHTML ? `
          <div class="financial-desc">
           <p> ${sectionDescriptionHTML}</p>
          </div>
        ` : ''}
  
        <div class="financial-tabs">
          <button class="tab active" data-company="airport">${tab1Text}</button>
          <button class="tab" data-company="infra">${tab2Text}</button>
        </div>
  
        <div class="financial-cards"></div>
  
        <div class="financial-cta">
          <a href="${ctaLink}" class="cta-btn">${ctaText}</a>
        </div>
      </div>
    `;
  
    const cardsContainer = block.querySelector('.financial-cards');
  
    function renderCards(type) {
      const cards = companyCards[type] || [];
      if (cards.length === 0) {
        cardsContainer.innerHTML = '<p>No financial reports available for this section.</p>';
        return;
      }
  
      cardsContainer.innerHTML = cards.map(card => `
        <a class="financial-card" href="${card.link}">
          <h3>${card.title}</h3>
          <span>VIEW NOW ></span>
        </a>
      `).join('');
    }
  
    renderCards('airport');
  
    // Tab switching
    block.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        block.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderCards(tab.dataset.company);
      });
    });
  }