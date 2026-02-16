import { PasswordEntryForm } from '@/components/password-entry-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Password | Account Security',
  description: 'Securely set your password to complete account setup',
};

export default function SetPasswordPage() {
  // In a real app, you'd get the email from query params, session, or auth context
  const userEmail = 'user@example.com';
  // Keep this page as a Server Component and pass only serializable props (strings, etc.).
  // The actual submit logic should run on the client (inside the client component) or
  // call an API route / server action. Avoid passing event handlers from server -> client.
  return <PasswordEntryForm email={userEmail} />;
}
