"use client";

import { useCallback } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import AuthForm from './auth-form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={handleCloseModal} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>

        {/* Main Content (reused form) */}
        <div className="p-6 lg:p-7 overflow-y-auto max-h-[72vh]">
          <AuthForm mode={mode} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
