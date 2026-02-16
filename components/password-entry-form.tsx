'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordEntryFormProps {
  email: string;
  onSubmit?: (password: string) => Promise<void> | void;
}

export function PasswordEntryForm({ email, onSubmit }: PasswordEntryFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isValid = passwordsMatch && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      if (onSubmit) {
        await onSubmit(password);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-accent/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-[#020E68]" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Password Set Successfully
          </h2>
          <p className="text-muted-foreground">
            Your password has been securely set. You can now access your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-accent/10 p-2.5">
              <Lock className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Set Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a secure password to protect your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/50 text-muted-foreground cursor-not-allowed text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This email cannot be changed
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Minimum 8 characters recommended
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive mt-1.5">
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-accent mt-1.5 flex items-center gap-1">
                <span className="text-base text-[#020E68]">✓</span> Passwords match
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting Password...' : 'Set Password'}
          </Button>

          {/* Helper Text */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            Your password is encrypted and secure
          </p>
        </form>
      </div>
    </div>
  );
}
