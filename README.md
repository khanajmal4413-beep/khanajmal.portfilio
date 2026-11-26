# Muhammad Ajmal — Portfolio

Personal portfolio of **Muhammad Ajmal**, Full-Stack Software Developer (.NET & JavaScript), Islamabad, Pakistan.

🔗 **Live site:** https://khanajmal4413-beep.github.io/khanajmal.portfilio/

Plain HTML, CSS and JavaScript with no build step and no dependencies. It is hosted free on GitHub Pages.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Page structure + SEO tags (title, description, Open Graph, canonical) |
| `config.js` | **All your personal information. Edit this file to update the site.** |
| `styles.css` | Design system, light/dark themes, layout, animations |
| `app.js` | Builds every section from `config.js` + all interactions |
| `profile.webp` / `profile.jpg` | Profile photo (WebP + JPG fallback) |
| `Muhammad_Ajmal_CV.pdf` | Downloadable resume |
| `og-image.jpg` | Preview image shown when the link is shared (LinkedIn, WhatsApp…) |
| `favicon.svg`, `apple-touch-icon.png` | Browser / phone icons |
| `robots.txt`, `sitemap.xml` | Search-engine files |
| `404.html` | "Page not found" page |

---

## Updating your information

Open **`config.js`** on GitHub → click ✏️ → edit → **Commit changes**. The site updates in 1–2 minutes.

- **New job:** add an item at the top of `experience` (`end: null` means "Present").
- **New project:** add an item to `projects`. Put a screenshot file in the repo and set `image: "my-shot.webp"`. Add `liveUrl` / `repoUrl` to show those buttons. Fill `challenge`, `solution`, `outcome` to show them in the project details.
- **Certificate:** add to `certifications` (`name`, `issuer`, `date`, `image`, `file`, `verifyUrl`). The section and its menu link appear automatically.
- **Testimonials:** add only genuine ones to `testimonials`. The section stays hidden while the list is empty.
- **New CV:** upload the PDF with the same name `Muhammad_Ajmal_CV.pdf` (or change `resume` in `config.js`).
- **New photo:** replace `profile.jpg` and `profile.webp` (same names, portrait 4:5).

Lines marked `TODO` in `config.js` are things only you can fill in.

---

## Contact form — receive messages in your inbox (free)

Until this is set up, the form opens the visitor's own email app with the message ready to send. It never shows a fake "sent" message.

1. Go to **https://web3forms.com**, enter `khanajmal4413@gmail.com`, and click **Create Access Key**.
2. Copy the key from the email you receive.
3. In `config.js`, paste it here: `web3formsKey: "YOUR-KEY"`, then commit.

The access key is designed to be public (it only allows sending to your email), so it is safe in this file.

**Spam protection:** a hidden honeypot field, a minimum fill time, a one-message-per-minute limit, and Web3Forms' own server-side filtering.

---

## Deploying (GitHub Pages)

1. Repo → **Add file → Upload files** → drag all files → **Commit changes**.
2. **Settings → Pages →** Source: *Deploy from a branch*, Branch: `main` / `(root)` → Save.
3. Wait 1–3 minutes. If you still see the old version, press **Ctrl + Shift + R**.

**If you rename the repository**, update the URL in these places: `config.js` (`site.url`), `index.html` (canonical + `og:` tags), `robots.txt`, `sitemap.xml`, and `404.html`.

The site also works as-is on **Netlify** or **Vercel**: drag the folder into Netlify Drop, or import the repo in Vercel with no build command.

### Run locally
```bash
python -m http.server 8000   # then open http://localhost:8000
```

---

## Quality checks performed

- Layout tested at 320, 375, 390, 480, 768, 1024, 1280, 1440 and 1920 px in light and dark: no horizontal scroll, no overflow, no console errors.
- axe-core accessibility scan (WCAG 2.1 AA + best practices) in both themes.
- Theme toggle and its persistence, mobile menu, project filters, modal (Esc / backdrop / close), form validation, keyboard navigation, and all asset links.
- Respects `prefers-reduced-motion`.
