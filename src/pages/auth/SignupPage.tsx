import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { BareLayout } from '@/app/layouts/BareLayout';
import { AuthShell } from '@/components/auth/AuthShell';
import { CinematicWipe } from '@/features/auth/CinematicWipe';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { pageTransition } from '@/utils/motion';
import { registerUser } from '@/services/authService';
import { saveToken } from '@/features/auth/authStorage';

export default function SignupPage() {
  const [wiping, setWiping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const confirmPassword = String(data.get('confirm_password') ?? '');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const { token } = await registerUser({
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });
      saveToken(token);
      setWiping(true);
      window.setTimeout(() => navigate(ROUTES.LANDING), 900);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not create account.';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <AuthShell
          side="left"
          title="Create your decision workspace."
          subtitle="Start free. Bring your highest-stakes questions. We'll guide you to a clear, defensible answer."
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input label="Full name"        name="name"             leftIcon={<FiUser />}  placeholder="Your Name" required />
            <Input label="Email"            name="email"            leftIcon={<FiMail />}  placeholder="you@company.com" type="email" required />
            <Input label="Password"         name="password"         leftIcon={<FiLock />}  placeholder="••••••••" type="password" required />
            <Input label="Confirm password" name="confirm_password" leftIcon={<FiLock />}  placeholder="••••••••" type="password" required />

            <div className="flex items-center gap-2 mt-1 text-xs text-tertiary">
              <input type="checkbox" id="tos" className="accent-[var(--brand-500)]" defaultChecked />
              <label htmlFor="tos">I agree to the Terms and Privacy Policy.</label>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl glass border border-rose-400/30 px-3 py-2 text-xs text-rose-300"
              >
                {error}
              </p>
            )}

            <Button
              size="lg"
              rightIcon={<FiArrowRight />}
              fullWidth
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
            <p className="mt-2 text-sm text-secondary">
              Already on HelpDesk?{' '}
              <button
                type="button"
                className="link-anim text-[var(--brand-300)]"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Sign in
              </button>
            </p>
          </form>
        </AuthShell>

        <CinematicWipe active={wiping} />
      </BareLayout>
    </motion.div>
  );
}
