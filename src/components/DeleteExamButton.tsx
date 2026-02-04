'use client';

import { deleteExamAction } from '@/actions/admin/deleteExam';
import { useState, useTransition } from 'react';

interface DeleteExamButtonProps {
  examId: number;
  examName: string;
  subjectName?: string | null;
  totalQuestions: number;
  disabled?: boolean;
  className?: string;
}

export function DeleteExamButton({ 
  examId, 
  examName, 
  subjectName, 
  totalQuestions, 
  disabled = false,
  className = "text-sm text-red-600 hover:underline hover:text-red-800"
}: DeleteExamButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const examDisplayName = `${subjectName || 'Subject'} — ${examName || `Exam #${examId}`}`;
    
    const confirmMessage = `Are you sure you want to delete "${examDisplayName}"?\n\nThis will permanently delete:\n• All ${totalQuestions} questions in this exam\n• All student attempts and results\n• The exam settings\n\nThis action cannot be undone!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('examId', examId.toString());
      await deleteExamAction(formData);
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={disabled || isPending}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={disabled ? "Cannot delete the last exam" : "Delete this exam"}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}