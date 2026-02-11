import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useLanguage } from '@/contexts/LanguageContext';

const FeedbackModal = () => {
  const { showFeedback, setShowFeedback, submitFeedback, currentActionType } = useFeedback();
  const { language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [autoClose, setAutoClose] = useState(30); // 30 second countdown

  // Auto-close after 30 seconds
  useEffect(() => {
    if (!showFeedback) return;

    const timer = setInterval(() => {
      setAutoClose((prev) => {
        if (prev <= 1) {
          setShowFeedback(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showFeedback, setShowFeedback]);

  const handleSubmit = () => {
    if (rating === 0) {
      alert(language === 'ar' ? 'يرجى اختيار تقييم' : 'Please select a rating');
      return;
    }

    submitFeedback({
      rating,
      comments,
      actionType: currentActionType,
    });

    // Reset form
    setRating(0);
    setComments('');
    setAutoClose(30);
  };

  const handleSkip = () => {
    setShowFeedback(false);
    setRating(0);
    setComments('');
    setAutoClose(30);
  };

  return (
    <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{language === 'ar' ? 'أخبرنا برأيك' : 'Share Your Feedback'}</DialogTitle>
          <DialogDescription>
            {language === 'ar' ? 'ساعدنا في تحسين خدماتنا' : 'Help us improve our services'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{language === 'ar' ? 'التقييم' : 'Rating'}</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </motion.button>
              ))}
            </div>
          </div>

          {/* Comments textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {language === 'ar' ? 'ملاحظات (اختيارية)' : 'Comments (Optional)'}
            </label>
            <Textarea
              placeholder={
                language === 'ar'
                  ? 'اكتب ملاحظاتك هنا...'
                  : 'Write your feedback here...'
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>

          {/* Auto-close countdown */}
          <div className="text-xs text-gray-500 text-center">
            {language === 'ar'
              ? `سيغلق تلقائياً خلال ${autoClose} ثانية`
              : `Auto-closes in ${autoClose} seconds`}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleSkip}>
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {language === 'ar' ? 'إرسال' : 'Submit'}
          </Button>
        </div>

        <DialogClose asChild>
          <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
