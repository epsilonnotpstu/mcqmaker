'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { PieChart, BarChart3, TrendingUp, Target, Clock, Award } from 'lucide-react';

interface PerformanceAnalysisProps {
  resultData: {
    correctAnswers: number;
    wrongAnswers: number;
    unattempted: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: number;
    grade: string;
  };
}

export default function PerformanceAnalysis({ resultData }: PerformanceAnalysisProps) {
  const { correctAnswers, wrongAnswers, unattempted, totalQuestions, percentage, timeTaken, grade } = resultData;
  
  const efficiency = Math.round((correctAnswers / Math.max(correctAnswers + wrongAnswers, 1)) * 100);
  const timePerQuestion = Math.round(timeTaken / totalQuestions);
  const completionRate = Math.round(((correctAnswers + wrongAnswers) / totalQuestions) * 100);
  
  const performanceData = [
    { label: 'সঠিক', value: correctAnswers, color: 'bg-green-500', percentage: Math.round((correctAnswers / totalQuestions) * 100) },
    { label: 'ভুল', value: wrongAnswers, color: 'bg-red-500', percentage: Math.round((wrongAnswers / totalQuestions) * 100) },
    { label: 'অনুত্তরিত', value: unattempted, color: 'bg-gray-400', percentage: Math.round((unattempted / totalQuestions) * 100) }
  ];

  const insights = [
    {
      icon: Target,
      label: 'নির্ভুলতার হার',
      value: `${efficiency}%`,
      description: 'যেসব প্রশ্নের উত্তর দিয়েছেন তার মধ্যে সঠিকের হার',
      color: efficiency >= 80 ? 'text-green-600' : efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: Clock,
      label: 'প্রশ্ন প্রতি সময়',
      value: `${timePerQuestion}s`,
      description: 'প্রতিটি প্রশ্নে গড়ে ব্যয়িত সময়',
      color: timePerQuestion <= 60 ? 'text-green-600' : timePerQuestion <= 90 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      icon: TrendingUp,
      label: 'সম্পূর্ণতার হার',
      value: `${completionRate}%`,
      description: 'মোট প্রশ্নের কতটা চেষ্টা করেছেন',
      color: completionRate >= 90 ? 'text-green-600' : completionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  const getGradeRecommendation = (grade: string, percentage: number) => {
    if (percentage >= 90) return { text: 'চমৎকার! আপনি অসাধারণ পারফরম্যান্স দেখিয়েছেন।', icon: Award, color: 'text-emerald-600' };
    if (percentage >= 80) return { text: 'খুব ভালো! একটু বেশি অনুশীলন করলে আরও ভালো হবে।', icon: Award, color: 'text-green-600' };
    if (percentage >= 70) return { text: 'ভালো! আরও পড়াশোনা করে উন্নতি করুন।', icon: TrendingUp, color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'মোটামুটি। আরও বেশি অনুশীলন প্রয়োজন।', icon: Target, color: 'text-yellow-600' };
    if (percentage >= 50) return { text: 'উন্নতি প্রয়োজন। মনোযোগ দিয়ে পড়ুন।', icon: TrendingUp, color: 'text-orange-600' };
    return { text: 'আরও কঠোর পরিশ্রম করুন। আপনি পারবেন!', icon: Target, color: 'text-red-600' };
  };

  const recommendation = getGradeRecommendation(grade, percentage);

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          পারফরম্যান্স বিশ্লেষণ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Performance Pie Chart Visual */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visual Representation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">ফলাফলের বিতরণ</h3>
            
            {/* Custom Pie Chart */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                
                {/* Correct answers arc */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="8"
                  strokeDasharray={`${(correctAnswers / totalQuestions) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                
                {/* Wrong answers arc */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="8"
                  strokeDasharray={`${(wrongAnswers / totalQuestions) * 251.2} 251.2`}
                  strokeDashoffset={`-${(correctAnswers / totalQuestions) * 251.2}`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    সামগ্রিক
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.value} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Performance Insights */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">পারফরম্যান্স সূচক</h3>
            
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <IconComponent className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{insight.label}</span>
                          <span className={`font-bold ${insight.color}`}>{insight.value}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <recommendation.icon className={`w-6 h-6 mt-1 ${recommendation.color}`} />
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">পরামর্শ</h4>
              <p className={`${recommendation.color} font-medium`}>{recommendation.text}</p>
            </div>
          </div>
        </div>
        
        {/* Study Tips based on performance */}
        {percentage < 70 && (
          <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📚 উন্নতির জন্য টিপস:</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• নিয়মিত অনুশীলন করুন</li>
              <li>• কঠিন বিষয়গুলোতে বেশি সময় দিন</li>
              <li>• পূর্ববর্তী প্রশ্নপত্র সমাধান করুন</li>
              <li>• সময় ব্যবস্থাপনা উন্নত করুন</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}