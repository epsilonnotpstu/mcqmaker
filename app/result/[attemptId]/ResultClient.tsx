'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import CelebrationAnimation from './CelebrationAnimation';
import PerformanceAnalysis from './PerformanceAnalysis';
import { 
  Trophy, CheckCircle, XCircle, Clock, Calendar, 
  Target, TrendingUp, Award, Star, Download, 
  Share2, Home, RotateCcw, BookOpen, BarChart3,
  PieChart, Timer, User, Medal, Zap, Eye, EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResultData {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  percentage: number;
  grade: string;
  details: Array<{
    questionId: number;
    question: string;
    options: string[];
    correctAnswer: number;
    userAnswer: number | null;
    isCorrect: boolean;
  }>;
  timeTaken: number;
  submittedAt: Date | null;
  startedAt: Date | null;
  examTitle: string;
  marksPerCorrect: number;
  negativePerWrong: number;
}

interface ResultClientProps {
  resultData: ResultData;
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A+': return 'text-emerald-600 dark:text-emerald-400';
    case 'A': return 'text-green-600 dark:text-green-400';
    case 'B': return 'text-blue-600 dark:text-blue-400';
    case 'C': return 'text-yellow-600 dark:text-yellow-400';
    case 'D': return 'text-orange-600 dark:text-orange-400';
    default: return 'text-red-600 dark:text-red-400';
  }
};

const getPerformanceBadge = (percentage: number) => {
  if (percentage >= 90) return { text: 'অসাধারণ', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' };
  if (percentage >= 80) return { text: 'খুব ভালো', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  if (percentage >= 70) return { text: 'ভালো', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
  if (percentage >= 60) return { text: 'মোটামুটি', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
  if (percentage >= 50) return { text: 'উন্নতি প্রয়োজন', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
  return { text: 'আরও চেষ্টা করুন', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function ResultClient({ resultData }: ResultClientProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const performanceBadge = getPerformanceBadge(resultData.percentage);

  // Animation effect for percentage
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = resultData.percentage / 50;
      const animate = () => {
        start += increment;
        if (start < resultData.percentage) {
          setAnimatedPercentage(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setAnimatedPercentage(resultData.percentage);
          // Show celebration for high scores
          if (resultData.percentage >= 80) {
            setTimeout(() => setShowCelebration(true), 500);
          }
        }
      };
      animate();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [resultData.percentage]);

  const handleDownloadPDF = () => {
    // PDF download functionality
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'পরীক্ষার ফলাফল',
        text: `আমি ${resultData.examTitle} এ ${resultData.percentage}% পেয়েছি!`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-blue-100/5 to-purple-100/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg">
            <Trophy className="w-6 h-6" />
            পরীক্ষার ফলাফল প্রকাশিত
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {resultData.examTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              আপনার পারফরম্যান্স রিপোর্ট
            </p>
          </div>
        </div>

        {/* Main Score Card */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              
              {/* Score Display */}
              <div className="text-center space-y-6">
                <div className="relative">
                  {/* Circular Progress */}
                  <div className="w-48 h-48 mx-auto relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${animatedPercentage * 2.83} 283`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {animatedPercentage}%
                        </div>
                        <div className={`text-2xl font-bold mt-2 ${getGradeColor(resultData.grade)}`}>
                          {resultData.grade}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Badge className={`text-lg px-6 py-2 rounded-full ${performanceBadge.color}`}>
                  {performanceBadge.text}
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Correct Answers */}
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {resultData.correctAnswers}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      সঠিক উত্তর
                    </div>
                  </div>

                  {/* Wrong Answers */}
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 text-center border border-red-200 dark:border-red-800">
                    <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600 dark:text-red-400" />
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                      {resultData.wrongAnswers}
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400">
                      ভুল উত্তর
                    </div>
                  </div>

                  {/* Unattempted */}
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {resultData.unattempted}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      অনুত্তরিত
                    </div>
                  </div>

                  {/* Score */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800">
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {resultData.score}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      মোট স্কোর
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">সামগ্রিক পারফরম্যান্স</span>
                    <span className="font-semibold">{resultData.percentage}%</span>
                  </div>
                  <Progress 
                    value={animatedPercentage} 
                    className="h-3 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Time Taken */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <Timer className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">সময় ব্যয়</h3>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatTime(resultData.timeTaken)}
              </p>
            </CardContent>
          </Card>

          {/* Total Questions */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">মোট প্রশ্ন</h3>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {resultData.totalQuestions}
              </p>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">নির্ভুলতা</h3>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {Math.round((resultData.correctAnswers / (resultData.correctAnswers + resultData.wrongAnswers || 1)) * 100)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analysis */}
        <PerformanceAnalysis resultData={resultData} />

        {/* Action Buttons */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => setShowDetails(!showDetails)} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {showDetails ? <EyeOff className="w-5 h-5 mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
                {showDetails ? 'বিস্তারিত লুকান' : 'বিস্তারিত দেখুন'}
              </Button>
              
              <Button onClick={handleDownloadPDF} size="lg" variant="outline" className="border-2 hover:bg-blue-50 dark:hover:bg-blue-950">
                <Download className="w-5 h-5 mr-2" />
                PDF ডাউনলোড
              </Button>
              
              <Button onClick={handleShare} size="lg" variant="outline" className="border-2 hover:bg-green-50 dark:hover:bg-green-950">
                <Share2 className="w-5 h-5 mr-2" />
                শেয়ার করুন
              </Button>
              
              <Button onClick={() => router.push('/')} size="lg" variant="outline" className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Home className="w-5 h-5 mr-2" />
                হোম পেজ
              </Button>
              
              <Button onClick={() => router.push('/exam')} size="lg" variant="outline" className="border-2 hover:bg-purple-50 dark:hover:bg-purple-950">
                <RotateCcw className="w-5 h-5 mr-2" />
                আবার পরীক্ষা দিন
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Answer Review */}
        {showDetails && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                বিস্তারিত উত্তর পর্যালোচনা
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {resultData.details.map((detail, index) => (
                  <div key={detail.questionId} className={`p-6 rounded-xl border-l-4 ${
                    detail.isCorrect 
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-500' 
                      : detail.userAnswer === null 
                      ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-400'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-500'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        প্রশ্ন {index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        {detail.isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {detail.userAnswer !== null && !detail.isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                        {detail.userAnswer === null && <Clock className="w-5 h-5 text-gray-500" />}
                        <span className={`font-semibold ${
                          detail.isCorrect 
                            ? 'text-green-600' 
                            : detail.userAnswer === null 
                            ? 'text-gray-500'
                            : 'text-red-600'
                        }`}>
                          {detail.isCorrect ? 'সঠিক' : detail.userAnswer === null ? 'অনুত্তরিত' : 'ভুল'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {detail.question}
                    </p>
                    
                    <div className="grid gap-3">
                      {detail.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`p-3 rounded-lg flex items-center gap-3 ${
                          optionIndex === detail.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700'
                            : optionIndex === detail.userAnswer && !detail.isCorrect
                            ? 'bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700'
                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                            optionIndex === detail.correctAnswer
                              ? 'bg-green-600 text-white'
                              : optionIndex === detail.userAnswer && !detail.isCorrect
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span className={optionIndex === detail.correctAnswer || (optionIndex === detail.userAnswer && !detail.isCorrect)
                            ? 'font-semibold' : ''
                          }>
                            {option}
                          </span>
                          {optionIndex === detail.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                          {optionIndex === detail.userAnswer && !detail.isCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam Metadata */}
        {resultData.submittedAt && (
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 to-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>জমা দেওয়ার সময়: {formatDate(new Date(resultData.submittedAt))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>পরীক্ষার্থী ID: ***</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Celebration Animation */}
      <CelebrationAnimation 
        show={showCelebration} 
        grade={resultData.grade} 
        percentage={resultData.percentage} 
      />
    </div>
  );
}