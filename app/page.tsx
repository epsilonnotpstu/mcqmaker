import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedStats } from '@/components/AnimatedStats';
import { FloatingExamInfo } from '@/components/FloatingExamInfo';
import { BookOpen, Clock, Award, CheckCircle, Users, TrendingUp, Play, Settings, Trophy, AlertCircle, Calendar, Timer } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function Home() {
  let activeExam: { 
    id: number; 
    examName: string | null; 
    subjectName: string | null; 
    chapterName: string | null; 
    totalTimeMinutes: number; 
    marksPerCorrect: number; 
    negativePerWrong: number; 
    isActive: boolean;
    totalQuestions: number;
  } | null = null;
  
  let examStats = {
    totalExams: 0,
    totalQuestions: 0,
    totalAttempts: 0
  };

  try {
    // Get active exam with question count
    const settings = await prisma.examSettings.findFirst({ 
      where: { isActive: true }, 
      orderBy: { updatedAt: 'desc' }
    });
    
    if (settings) {
      const questionCount = await prisma.question.count({ where: { examId: settings.id } });
      activeExam = {
        ...settings,
        totalQuestions: questionCount
      };
    }

    // Get overall stats
    examStats = {
      totalExams: await prisma.examSettings.count(),
      totalQuestions: await prisma.question.count(),
      totalAttempts: await prisma.studentAttempt.count({ where: { status: 'submitted' } })
    };
  } catch {
    // DB not configured; fall back to defaults
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                MCQ পরীক্ষা সিস্টেম
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                আধুনিক অনলাইন পরীক্ষা প্ল্যাটফর্ম - আপনার জ্ঞান পরীক্ষা করুন এবং সফলতার পথে এগিয়ে চলুন
              </p>
            </div>
            
            {/* Stats */}
            <AnimatedStats
              totalExams={examStats.totalExams}
              totalQuestions={examStats.totalQuestions}
              totalAttempts={examStats.totalAttempts}
            />
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        {/* Active Exam Section */}
        {activeExam ? (
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                LIVE পরীক্ষা চলমান
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                চলমান পরীক্ষা
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                এখনই অংশগ্রহণ করুন এবং আপনার দক্ষতা প্রমাণ করুন
              </p>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-500 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {activeExam.subjectName || 'বিষয়'} — {activeExam.examName || `পরীক্ষা #${activeExam.id}`}
                      </h3>
                      {activeExam.chapterName && (
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          চ্যাপ্টার: {activeExam.chapterName}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium">প্রশ্ন</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {activeExam.totalQuestions}টি
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                          <Timer className="w-4 h-4" />
                          <span className="text-sm font-medium">সময়</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {activeExam.totalTimeMinutes} মিনিট
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <Link href="/enter" className="flex-1">
                        <Button size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                          <Play className="w-6 h-6 mr-3" />
                          পরীক্ষা শুরু করুন
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      মার্কিং সিস্টেম
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">সঠিক উত্তর:</span>
                        <span className="font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                          +{activeExam.marksPerCorrect}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">ভুল উত্তর:</span>
                        <span className="font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                          {activeExam.negativePerWrong}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">উত্তর না দিলে:</span>
                        <span className="font-bold text-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                          0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              কোনো সক্রিয় পরীক্ষা নেই
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              বর্তমানে কোনো পরীক্ষা চালু নেই। পরবর্তী পরীক্ষার জন্য অপেক্ষা করুন।
            </p>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-bold">বিভিন্ন বিষয়</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                গণিত, বিজ্ঞান, ইংরেজি সহ বিভিন্ন বিষয়ের উপর পরীক্ষা দিন
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl font-bold">তাৎক্ষণিক ফলাফল</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                পরীক্ষা শেষেই আপনার ফলাফল এবং বিস্তারিত বিশ্লেষণ পান
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl font-bold">র‍্যাঙ্কিং সিস্টেম</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                অন্যদের সাথে প্রতিযোগিতা করুন এবং আপনার অবস্থান দেখুন
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rules Section */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              পরীক্ষার নিয়মাবলী
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">একবার উত্তর সিলেক্ট করলে পরিবর্তন করা যাবে</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">সময় শেষ হলে স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">3</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">নেগেটিভ মার্কিং আছে - সাবধানে উত্তর দিন</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">4</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">সব প্রশ্নের উত্তর দেওয়ার পর জমা দিতে পারবেন</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Admin Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105">
                <Settings className="w-5 h-5 mr-2" />
                অ্যাডমিন প্যানেল
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            অ্যাডমিনিস্ট্রেটরদের জন্য পৃথক লগইন এবং ড্যাশবোর্ড
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">MCQ পরীক্ষা সিস্টেম</h3>
          <p className="text-gray-300 mb-6">আধুনিক শিক্ষা ব্যবস্থার জন্য সম্পূর্ণ ডিজিটাল সমাধান</p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <span>© 2026 সকল অধিকার সংরক্ষিত</span>
            <span>•</span>
            <span>প্রিমিয়াম কোয়ালিটি</span>
            <span>•</span>
            <span>সিকিউর প্ল্যাটফর্ম</span>
          </div>
        </div>
      </footer>

      {/* Floating Exam Info */}
      {activeExam && (
        <FloatingExamInfo
          examName={activeExam.examName || `পরীক্ষা #${activeExam.id}`}
          subjectName={activeExam.subjectName || 'বিষয়'}
          totalQuestions={activeExam.totalQuestions}
          timeMinutes={activeExam.totalTimeMinutes}
        />
      )}
    </div>
  );
}
