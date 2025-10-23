# เว็บไซต์ร้าน นวด สปา และ Permanent Makeup (Vite)

โปรเจกต์นี้เป็นเว็บหน้าเดียว (Single Page) ด้วย Vite พร้อมสำหรับ Deploy ขึ้น Vercel ทันที มีส่วนประกอบหลัก: Hero, บริการ, Permanent Makeup, โปรโมชัน, แกลเลอรี, ราคา, รีวิว, แผนที่, ติดต่อ/จอง และ Footer

> หมายเหตุ: สีและโทนถูกออกแบบให้อบอุ่น พรีเมียม (ทอง/ครีม/เขียวเข้ม/ชมพูอ่อน) ให้เข้ากับบรรยากาศร้านสปา สามารถปรับได้ใน `src/style.css` (ตัวแปร CSS)

## โครงสร้างไฟล์

- `index.html` — โครงหน้าเดียว พร้อมเมนู Anchor และ SEO meta
- `src/main.js` — โค้ดสำหรับเมนูมือถือ, smooth scroll, active link, animation
- `src/style.css` — สไตล์หลัก, ตัวแปรสี, responsive layout
- `public/logo.svg` — โลโก้ (ตัวอย่าง) แทนที่ด้วยโลโก้จริงของคุณ โดยใช้ชื่อไฟล์เดิม
- `public/favicon.svg` — ไอคอนเว็บไซต์
- `public/og-image.jpg` — รูปสำหรับแชร์ (แก้ไขภายหลัง)
- `package.json` — สคริปต์และ devDependencies ของ Vite

## การติดตั้งและรัน (macOS / zsh)

รองรับทั้ง Bun และ npm (แนะนำ Bun ตามที่ติดตั้งไว้แล้ว)

### ใช้ Bun

```zsh
# ติดตั้ง dependencies และสร้าง bun.lockb
bun install

# รันโหมดพัฒนา
bun run dev

# สร้างไฟล์สำหรับโปรดักชัน
bun run build

# พรีวิวไฟล์ build
bun run preview
```

### หรือใช้ npm

```zsh
npm install
npm run dev
npm run build
npm run preview
```

เปิดเบราว์เซอร์ไปที่ลิงก์ที่แสดง (เช่น http://localhost:5173)

## การปรับข้อมูลร้าน

- ชื่อร้าน/สโลแกน: ปรับใน `index.html` (ส่วน header/hero/footer)
- โลโก้: นำไฟล์โลโก้จริงมาแทนที่ `public/logo.svg` (ใช้ชื่อไฟล์เดิมเพื่อไม่ต้องแก้โค้ด)
- เบอร์โทร/LINE/WhatsApp: แก้ในส่วน Contact ของ `index.html`
- ที่อยู่/เวลาเปิด-ปิด: แก้ในส่วน Location ของ `index.html`
- แผนที่ Google: เปลี่ยน `src` ของ `<iframe>` เป็นลิงก์แผนที่จริงของร้าน
- รายการ/ราคาบริการ: แก้ในส่วน Pricing ของ `index.html`
- สีหลัก/ธีม: ปรับตัวแปรใน `src/style.css` (เช่น `--primary`, `--accent`, `--bg`)

## Deploy ขึ้น Vercel

วิธีที่ง่ายที่สุดคือใช้ Vercel CLI หรือเชื่อม Git repo กับ Vercel

### ตัวเลือก A: ใช้ Vercel CLI (เร็วมาก)

```zsh
# ติดตั้ง vercel CLI (ครั้งแรกครั้งเดียว)
npm i -g vercel

# จากโฟลเดอร์โปรเจกต์นี้
vercel

# ครั้งต่อไปสำหรับโปรดักชัน
vercel --prod
```

Vercel จะตรวจจับโปรเจกต์ Vite อัตโนมัติ: Build Command = `vite build`, Output = `dist`

ถ้าใช้ Bun, Vercel จะอ่าน `bun.lockb` และใช้ `bun install`/`bun run build` อัตโนมัติ (หรือกำหนดเองใน Project Settings ก็ได้)

### ตัวเลือก B: เชื่อมต่อ Git (GitHub/GitLab/Bitbucket)

1. สร้าง repository แล้ว push โปรเจกต์นี้ขึ้น Git
2. เข้า https://vercel.com สร้างโปรเจกต์ใหม่ เลือก repo
3. ตั้งค่า Framework Preset: Vite (ถ้าไม่ได้ตรวจจับให้อัปเดต Build Command/Output ตามด้านบน)
4. กด Deploy

> ไม่จำเป็นต้องมี `vercel.json` สำหรับเว็บ static ปกติ แต่สามารถเพิ่มภายหลังได้หากต้องการตั้งค่าพิเศษ

## (ทางเลือก) ใช้ Elysia เป็น API บางส่วน

คุณระบุว่ามี Bun + Elysia แล้ว หากต้องการเพิ่ม API ง่าย ๆ (เช่น webhook/form) สามารถสร้างโฟลเดอร์ `api/` และใช้ Edge Runtime ได้ เช่น

```ts
// api/ping.ts (Edge Function)
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => ({ ok: true }));

export const config = { runtime: "edge" }; // ให้รันบน Edge
export default (req: Request) => app.fetch(req);
```

> สำหรับเว็บนี้ยังไม่จำเป็นต้องมี backend เนื่องจากเป็น static SPA แต่รองรับการเพิ่มได้ภายหลัง

## เคล็ดลับแก้ปัญหา

- ถ้า build ไม่ผ่าน ให้ตรวจ Node.js เวอร์ชัน (`node -v`) ควรเป็น >= 18
- ถ้าฟอนต์ไม่แสดง: ตรวจลิงก์ Google Fonts ใน `<head>` ของ `index.html`
- ถ้ารูปโลโก้ไม่ขึ้น: ตรวจว่าทับไฟล์ `public/logo.svg` แล้ว และ path ในหน้าเป็น `/logo.svg`

## ลิขสิทธิ์และสื่อ

รูป/โลโก้/ข้อความในโปรเจกต์นี้เป็นตัวอย่าง กรุณาแทนที่ด้วยไฟล์จริงของร้านคุณเอง
