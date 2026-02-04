import { Question } from './types';

export const QUIZ_CONFIG = {
  totalTime: 10 * 60, // seconds
  correctPoints: 4,
  wrongPoints: -1,
  unattemptedPoints: 0,
  passPercentage: 40,
};

export const questions: Question[] = [
  {
    id: 1,
    question: 'বাংলার রাজধানী কোনটি?',
    options: ['ঢাকা', 'চট্টগ্রাম', 'খুলনা', 'রাজশাহী'],
    correctAnswer: 0,
    subject: 'ভূগোল',
  },
  {
    id: 2,
    question: 'পৃথিবীর সবচেয়ে বড় মহাসাগর কোনটি?',
    options: ['আটলান্টিক', 'ইন্ডিয়ান', 'প্যাসেফিক', 'আর্টিক'],
    correctAnswer: 2,
    subject: 'জ্যোগ্রাফি',
  },
  {
    id: 3,
    question: 'মানবদেহে হার্ট কোন সৌমায়ে অবস্থিত?',
    options: ['বাম দিকে', 'ডান দিকে', 'মধ্যভাগে', 'উপরের দিকে'],
    correctAnswer: 0,
    subject: 'বিজ্ঞান',
  },
  {
    id: 4,
    question: 'বাংলাদেশ স্বাধীন হলো কোন সালে?',
    options: ['1970', '1971', '1969', '1972'],
    correctAnswer: 1,
    subject: 'ইতিহাস',
  },
  {
    id: 5,
    question: 'পাইথন কোন ধরনের ভাষা?',
    options: ['কম্পাইল্ড', 'ইন্টারপ্রেটেড', 'অ্যাসেম্বলি', 'মেশিন কোড'],
    correctAnswer: 1,
    subject: 'কম্পিউটার',
  },
];
