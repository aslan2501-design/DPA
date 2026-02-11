import React, { createContext, useContext, useState, ReactNode } from 'react';
import { triggerBasicConfetti, triggerSuccessConfetti } from '@/lib/confetti';

interface FeedbackData {
  rating: number; // 1-5 stars
  comments: string;
  actionType?: string; // e.g., 'complaint', 'warehouse_rental', 'request'
}

interface FeedbackContextType {
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
  triggerFeedback: (actionType?: string) => void;
  triggerConfetti: (type?: 'basic' | 'success') => void;
  submitFeedback: (data: FeedbackData) => void;
  currentActionType?: string;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentActionType, setCurrentActionType] = useState<string | undefined>();

  const triggerFeedback = (actionType?: string) => {
    setCurrentActionType(actionType);
    setShowFeedback(true);
  };

  const triggerConfetti = (type: 'basic' | 'success' = 'success') => {
    if (type === 'success') {
      triggerSuccessConfetti();
    } else {
      triggerBasicConfetti();
    }
  };

  const submitFeedback = (data: FeedbackData) => {
    // Log feedback (in real app, send to backend)
    console.log('Feedback submitted:', {
      ...data,
      actionType: currentActionType,
      timestamp: new Date().toISOString(),
    });

    // Save to localStorage for demo
    try {
      const feedbackList = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
      feedbackList.push({
        ...data,
        actionType: currentActionType,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('feedbackHistory', JSON.stringify(feedbackList));
    } catch (e) {
      console.error('Failed to save feedback:', e);
    }

    setShowFeedback(false);
    setCurrentActionType(undefined);
  };

  return (
    <FeedbackContext.Provider
      value={{
        showFeedback,
        setShowFeedback,
        triggerFeedback,
        triggerConfetti,
        submitFeedback,
        currentActionType,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};
