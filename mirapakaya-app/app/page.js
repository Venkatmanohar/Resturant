import { getBusiness, getMenuItems } from '@/lib/db';

export const revalidate = 0; // always fetch fresh data

function heatDots(level) {
  return '\uD83C\uDF36\uFE0F'.repeat(level); // 🌶️ repeated
}

export default async function HomePage() {
  let business = null;
  let menu = [];

  try {
    business = await getBusiness();
    menu = await getMenuItems();
  } catch (e) {
    // DB not initialized yet
  }

  if (!business) {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Database not set up yet</h1>
        <p style={{ marginTop: 12, opacity: 0.7 }}>
          Visit <code>/api/init-db?key=YOUR_ADMIN_PASSWORD</code> once to create and seed the database.
        </p>
      </div>
    );
  }

  const waNumber = business.phone.replace('+', '');
  const grouped = {};
  const cats = [];
  menu.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
      cats.push(item.category);
    }
    grouped[item.category].push(item);
  });
  const spiciest = [...menu].sort((a, b) => b.heat - a.heat).slice(0, 3);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="logo">{business.name}</div>
          <a className="call-btn" href={`tel:${business.phone}`}>Call to Order</a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Cloud Kitchen · Home Delivery Only</div>
            <h1 className="hero-title">Andhra heat,<br />cooked fresh,<br />delivered hot.</h1>
            <p className="hero-sub">{business.tagline}</p>
            <div className="hero-ctas">
              <a className="btn-primary" href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                WhatsApp Your Order
              </a>
              <a className="btn-secondary" href={`tel:${business.phone}`}>Call {business.phone}</a>
            </div>
          </div>

          {spiciest.length > 0 && (
            <div className="heat-card">
              <h3>Today's Heat Guide</h3>
              <p>So you know what you're getting into</p>
              {spiciest.map((item) => (
                <div className="heat-row" key={item.id}>
                  <span>{item.name}</span>
                  <span className="chilis">{heatDots(item.heat) || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="menu-section" id="menu">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">The Menu</div>
            <h2>What's cooking today</h2>
          </div>
          <div className="menu-grid">
            {cats.map((cat) => (
              <div key={cat} style={{ display: 'contents' }}>
                <div className="menu-cat-title">{cat}</div>
                {grouped[cat].map((item) => (
                  <div className="menu-item" key={item.id}>
                    <div>
                      <div className="menu-item-name">{item.name}</div>
                      <div className="menu-item-desc">{item.description}</div>
                    </div>
                    <div className="menu-item-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section" id="delivery">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Good to know</div>
            <h2>Delivery details</h2>
          </div>
          <div className="info-grid">
            <div className="info-block">
              <h3>Delivery Area</h3>
              <p>{business.area}</p>
            </div>
            <div className="info-block">
              <h3>Hours</h3>
              <p>{business.hours}</p>
            </div>
            <div className="info-block">
              <h3>Contact</h3>
              <p>
                Call: {business.phone}<br />
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {business.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} {business.name} · Home-style Andhra food, cooked to order</footer>

      <a className="float-wa" href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp">
        💬
      </a>
    </>
  );
}
