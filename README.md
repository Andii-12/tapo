# ТАРО — Mongolian Tarot Reading Platform

Minimalist black-and-white full-stack tarot reading website with Mongolian UI.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion
- MongoDB + Mongoose
- Zod + React Hook Form
- Mock/QPay payment adapter
- Nodemailer email + PDFKit PDF generation

## Quick start

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Set at least:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`

### 3. MongoDB

Start local MongoDB, then seed cards and admin:

```bash
npm run seed
npm run seed:admin
```

Default admin after `seed:admin`:

- Email: value of `ADMIN_EMAIL` (default `admin@tarot.mn`)
- Password: `admin123456` (change immediately)

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Features

- 72 tarot cards, Fisher–Yates shuffle per session
- 3-card and 5-card readings with free preview + paid unlock
- Free Yes/No single-card reading
- Secure access tokens on result URLs
- Mock payment (dev) + QPay adapter stub
- PDF download and email delivery (free vs paid content)
- Admin panel: readings, cards, prices, resend email

## Payment (dev)

On unpaid result pages, open payment modal and use:

**Туршилтын төлбөр амжилттай болгох**

This button appears only when `NODE_ENV !== production`.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed 72 cards + SVG images |
| `npm run seed:admin` | Create admin password hash in `.env.local` |

## Security notes

- Paid interpretations are never sent to the client before server-verified payment
- Webhook signature verification for non-mock providers
- Rate limiting on create/generate/email/payment-status
- Admin auth via HTTP-only JWT cookie

## Disclaimer

Энэхүү үйлчилгээ нь зөвхөн зугаа цэнгэл, өөрийгөө эргэцүүлэх зориулалттай.
