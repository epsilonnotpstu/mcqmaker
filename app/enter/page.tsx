
'use client';

import { useTransition, useState } from 'react';
import { enterAction } from '@/actions/enter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, ArrowRight, BookOpen, Clock, Award, Shield, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EnterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await enterAction(fd);
      if (res && !res.ok) {
        setError(res.error || 'পরীক্ষা শুরু করতে সমস্যা হয়েছে');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-200/40 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300/20 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            পরীক্ষায় প্রবেশ করুন
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            আপনার তথ্য প্রদান করে পরীক্ষা শুরু করুন। সফলতার পথে আরও এক ধাপ এগিয়ে যান।
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              পরীক্ষার্থীর তথ্য
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              নিরাপত্তা এবং সঠিকতার জন্য আপনার সঠিক তথ্য প্রদান করুন
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-blue-500" />
                  পূর্ণ নাম
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-green-500" />
                  মোবাইল নম্বর
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX (১১ সংখ্যা)"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  আপনার মোবাইল নম্বর সুরক্ষিত রাখা হবে
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    পরীক্ষা প্রস্তুত করা হচ্ছে...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    পরীক্ষা শুরু করুন
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">স্বয়ংক্রিয় সময়</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">নিরাপদ প্রক্রিয়া</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">তাৎক্ষণিক ফলাফল</span>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
