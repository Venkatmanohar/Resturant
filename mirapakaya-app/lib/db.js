import { sql } from '@vercel/postgres';

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS business (
      id INT PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      area TEXT NOT NULL,
      hours TEXT NOT NULL,
      tagline TEXT NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price INT NOT NULL,
      category TEXT NOT NULL,
      heat INT DEFAULT 0,
      sort_order INT DEFAULT 0
    );
  `;

  const existing = await sql`SELECT id FROM business WHERE id = 1;`;
  if (existing.rows.length === 0) {
    await sql`
      INSERT INTO business (id, name, phone, area, hours, tagline)
      VALUES (
        1,
        'Mirapakaya Kitchen',
        '+919999999999',
        'Within 5 km of Tadepalligudem',
        'Lunch 12-3pm - Dinner 7-10:30pm - Closed Mondays',
        'Real Andhra home-style meals - no dine-in, no shortcuts. Call or WhatsApp your order and we will have it at your door within the hour.'
      );
    `;
  }

  const items = await sql`SELECT id FROM menu_items LIMIT 1;`;
  if (items.rows.length === 0) {
    const seed = [
      ['Chicken 65', 'Deep-fried, curry leaf & garlic tempered', 220, 'Starters', 2, 1],
      ['Gutti Vankaya Fry', 'Stuffed brinjal, peanut-sesame masala', 160, 'Starters', 1, 2],
      ['Gongura Mutton', 'Sorrel leaf curry, slow-cooked', 340, 'Mains', 3, 1],
      ['Pappu & Rice Combo', 'Dal, rice, ghee, pickle', 140, 'Mains', 1, 2],
      ['Curd Rice', 'Cooling, tempered with curry leaf', 90, 'Sides & Extras', 0, 1],
      ['Avakaya Pickle (100g)', 'Traditional mango pickle', 80, 'Sides & Extras', 2, 2],
    ];
    for (const [name, description, price, category, heat, sort_order] of seed) {
      await sql`
        INSERT INTO menu_items (name, description, price, category, heat, sort_order)
        VALUES (${name}, ${description}, ${price}, ${category}, ${heat}, ${sort_order});
      `;
    }
  }
}

export async function getBusiness() {
  const { rows } = await sql`SELECT * FROM business WHERE id = 1;`;
  return rows[0] || null;
}

export async function updateBusiness({ name, phone, area, hours, tagline }) {
  await sql`
    UPDATE business
    SET name = ${name}, phone = ${phone}, area = ${area}, hours = ${hours}, tagline = ${tagline}
    WHERE id = 1;
  `;
  return getBusiness();
}

export async function getMenuItems() {
  const { rows } = await sql`
    SELECT * FROM menu_items ORDER BY category, sort_order, id;
  `;
  return rows;
}

export async function addMenuItem({ name, description, price, category, heat }) {
  const { rows } = await sql`
    INSERT INTO menu_items (name, description, price, category, heat)
    VALUES (${name}, ${description || ''}, ${price}, ${category}, ${heat || 0})
    RETURNING *;
  `;
  return rows[0];
}

export async function updateMenuItem(id, { name, description, price, category, heat }) {
  const { rows } = await sql`
    UPDATE menu_items
    SET name = ${name}, description = ${description || ''}, price = ${price},
        category = ${category}, heat = ${heat || 0}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0];
}

export async function deleteMenuItem(id) {
  await sql`DELETE FROM menu_items WHERE id = ${id};`;
}
