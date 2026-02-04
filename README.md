# MCQ Exam Application 🎓

A complete MCQ (Multiple Choice Question) exam platform built with Next.js, TypeScript, and PostgreSQL.

## ✨ Features

- **Admin Panel**: Create and manage MCQ exams
- **Student Interface**: Take MCQ exams with timer
- **Real-time Timer**: Automatic submission when time runs out
- **Score Calculation**: Positive/negative marking system
- **Result Analysis**: Detailed answer review

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **State Management**: Zustand

## 🚀 Free Hosting Options

### Option 1: Vercel (Recommended ⭐)

**Why Vercel?**
- Next.js optimized
- Free PostgreSQL via Neon
- Auto deployments
- 100GB bandwidth/month

**Steps:**
1. Push to GitHub:
```bash
git add .
git commit -m "Ready for deployment"  
git push origin main
```

2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Add Database: Storage → Create → Neon PostgreSQL
4. Environment Variables:
   - `DATABASE_URL`: From Neon dashboard
   - `JWT_SECRET`: Generate random string

### Option 2: Railway 🚄

- Free PostgreSQL included
- $5 monthly credit
- Go to [railway.app](https://railway.app)

### Option 3: Render 🎨

- 750 hours/month free
- PostgreSQL 90 days free
- Go to [render.com](https://render.com)

## 📋 Environment Variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password"
```

## 🏃‍♂️ Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Seed sample data
npm run db:seed

# Run development
npm run dev
```

## 🌐 Production Deployment Steps

1. **Build Test**: `npm run build` ✅
2. **Database**: Setup PostgreSQL on chosen platform
3. **Environment**: Set DATABASE_URL and JWT_SECRET
4. **Migrate**: `npx prisma migrate deploy`
5. **Seed**: `npm run db:seed`
6. **Deploy**: Platform will auto-deploy

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # React components
├── actions/            # Server actions
├── lib/                # Utilities
├── prisma/             # Database schema
└── public/             # Static files
```

## 👤 Admin Access

1. Go to `/admin/login`
2. Use environment credentials
3. Create exams and questions

## 🎯 Student Flow

1. Visit homepage → Enter details
2. Take active exam
3. View results

## ⚠️ Free Hosting Limits

- **Vercel**: 100GB/month bandwidth, 1000 functions/day
- **Railway**: $5 credit/month
- **Render**: 750 hours/month

## 🔧 Troubleshooting

- **Build fails**: Check TypeScript errors
- **Database issues**: Verify DATABASE_URL
- **Auth problems**: Check JWT_SECRET

---

✅ **Ready for deployment!** Choose your platform and follow the steps above.
# Updated Wed Feb  4 08:54:32 PM +06 2026
