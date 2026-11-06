# Little Pilgrim's Umrah Quest 3D 🕋✨

An interactive 3D, first-person POV (point-of-view), mobile-responsive educational experience designed to teach kids how to perform Umrah with **Sabr (patience)**, **Shukr (gratitude)**, **Ikhlas (pure intention)**, **Forgiveness ('Afw & Istighfar)**, and **Khushu (focus)**.

---

## 🌟 Spiritual Virtues & Educational Rites

1. **Pure Intention & Ihram (Step 1 — The Meeqat)**
   - Learning about the 2 unstitched white cloths for boys and modest pilgrim dress for girls.
   - Sincere Intention (Niyyah): *"Labbayk Allahumma Umrah"*.
   - **The Sabr Shield Challenge**: Interactive game where kids pop angry thoughts into bubbles of patience, gentleness, and peace.
   - Quran Recitation: Surah Al-Baqarah [2:197].

2. **The Holy Ka'bah & Tawaf (Step 2 — Al-Masjid Al-Haram)**
   - 3D First-Person View of the Mataf with realistic Kiswah embroidery, golden door (Bab ar-Rahman), Black Stone (al-Hajar al-Aswad), and Hijr Ismail.
   - **Green Light Starting Line**: Teaches kids to spot the green light beacon aligned with the Black Stone.
   - **7 Circuits Counter**: Step-by-step dhikr for each round (*SubhanAllah*, *Alhamdulillah*, *Allahu Akbar*, etc.).
   - **Tawaf Du'a**: Recitation of Surah Al-Baqarah [2:201] between the Yemeni corner and the Black Stone.
   - **Maqam Ibrahim & Zamzam**: Praying 2 Rak'ahs behind the crystal shrine (Surah Al-Baqarah [2:125]) and drinking Zamzam with the Sunnah du'a and 3 sips.

3. **Sa'i between Safa & Marwah (Step 3 — The Masa'a)**
   - Walking the historic path of Lady Hajar and baby Ismail.
   - **Emerald Green Light Zone**: Speed boost where kids briskly jog following the Sunnah.
   - Quran Recitation: Surah Al-Baqarah [2:158].
   - 7 Laps tracker from Mount Safa to Mount Marwah.

4. **Taqsir & Halq (Step 4 — Hair Trimming & Renewal)**
   - Symbolizing humility, shedding previous mistakes, and starting with a clean slate.
   - Quran Recitation: Surah Al-Fath [48:27].
   - **Printable Umrah Diploma**: Personalized with the child's name and earned virtue badges.

---

## 🌿 Islamic Art & Audio Guidelines

- **Strictly 100% Halal Audio**: Zero musical instruments. Uses authentic Quran recitations by Sheikh Mishary Rashid Alafasy and pure natural ambient sound effects (gentle desert breeze, Zamzam water drops).
- **No Human Faces or Animals**: Fellow pilgrims are rendered as graceful, glowing white translucent silhouettes in Ihram.

---

## 🚀 Deployment to Cloudflare Pages

### Option 1: Direct Cloudflare Pages Git Integration (Recommended)
1. Push this repository to your GitHub account.
2. In the **Cloudflare Dashboard**, navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select this repository.
4. Set the build configuration:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Cloudflare will automatically build and publish your site with a free `*.pages.dev` URL and global CDN!

### Option 2: Deploying via Wrangler CLI
If you have a Cloudflare API token:
```bash
export CLOUDFLARE_API_TOKEN="your-api-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
npx wrangler pages deploy dist --project-name umrah-quest-3d
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Build standalone bundle
npm run build

# Start local server
npm run serve
```
