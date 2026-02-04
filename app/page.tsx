import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Award, CheckCircle } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function Home() {
  let settings: { id: number; examName: string | null; subjectName: string | null; chapterName: string | null; totalTimeMinutes: number; marksPerCorrect: number; negativePerWrong: number; isActive: boolean } | null = null;
  let totalQuestions = 0;
  try {
    settings = await prisma.examSettings.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
    if (settings) {
      totalQuestions = await prisma.question.count({ where: { examId: settings.id } });
    } else {
      totalQuestions = await prisma.question.count();
    }
  } catch {
    // DB not configured; fall back to defaults
  }
  const timeMinutes = settings?.totalTimeMinutes ?? 60;
  const passPercentage = 50; // display-only; pass logic handled on result
  const correctPoints = settings?.marksPerCorrect ?? 4;
  const wrongPoints = settings?.negativePerWrong ?? -1;
  const unattemptedPoints = 0;
  const isActive = settings?.isActive ?? false;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            MCQ পরীক্ষা সিস্টেম
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            আপনার জ্ঞান পরীক্ষা করুন এবং নিজেকে যাচাই করুন
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                পরীক্ষার তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">মোট প্রশ্ন:</span>
                <span className="font-semibold">{totalQuestions}টি</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">সময়:</span>
                <span className="font-semibold">{timeMinutes} মিনিট</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">পাসের নম্বর:</span>
                <span className="font-semibold">{passPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">পরীক্ষার নাম:</span>
                <span className="font-semibold">{settings?.examName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">বিষয়:</span>
                <span className="font-semibold">{settings?.subjectName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">চ্যাপ্টার:</span>
                <span className="font-semibold">{settings?.chapterName || '—'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                মার্কিং সিস্টেম
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">সঠিক উত্তর:</span>
                <span className="font-semibold text-green-600">+{correctPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ভুল উত্তর:</span>
                <span className="font-semibold text-red-600">{wrongPoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">উত্তর না দিলে:</span>
                <span className="font-semibold text-gray-600">{unattemptedPoints}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              নিয়মাবলী
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>একবার উত্তর সিলেক্ট করলে পরিবর্তন করা যাবে না</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>সময় শেষ হলে স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>সব প্রশ্নের উত্তর দেওয়ার পর জমা দিতে পারবেন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>নেগেটিভ মার্কিং আছে - সাবধানে উত্তর দিন</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          {isActive ? (
            <Link href="/enter">
              <Button size="lg" className="text-lg px-12 py-6">
                <Clock className="w-5 h-5 mr-2" />
                পরীক্ষা শুরু করুন
              </Button>
            </Link>
          ) : (
            <Button size="lg" disabled className="text-lg px-12 py-6 opacity-70">
              পরীক্ষা বর্তমানে সক্রিয় নয়
            </Button>
          )}
          <Link href="/admin/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">এডমিন</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
