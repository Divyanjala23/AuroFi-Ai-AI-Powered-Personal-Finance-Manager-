import React, { useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    const styles = {
      success: {
        bg: 'bg-gradient-to-r from-teal-500 to-emerald-500',
        icon: CheckCircle
      },
      error: {
        bg: 'bg-gradient-to-r from-red-500 to-rose-500',
        icon: XCircle
      },
      warning: {
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
        icon: AlertCircle
      },
      info: {
        bg: 'bg-gradient-to-r from-teal-600 to-teal-500',
        icon: Info
      }
    };
    return styles[type] || styles.info;
  };

  const { bg, icon: Icon } = getTypeStyles();

  return (
    <div className={`
      fixed bottom-4 right-4 
      ${bg}
      text-white 
      rounded-2xl 
      shadow-lg 
      p-4 
      min-w-[320px]
      animate-slide-up
      flex 
      items-center 
      gap-3
      backdrop-blur-sm 
      bg-opacity-95
    `}>
      <div className="bg-white/20 p-2 rounded-xl">
        <Icon className="h-5 w-5" />
      </div>
      
      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      {onClose && (
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Add keyframe animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default Notification;