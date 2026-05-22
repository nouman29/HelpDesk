import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { BareLayout } from '@/app/layouts/BareLayout';
import { AuthShell } from '@/components/auth/AuthShell';
import { CinematicWipe } from '@/features/auth/CinematicWipe';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { pageTransition } from '@/utils/motion';
import { loginUser } from '@/services/authService';
import { saveToken } from '@/features/auth/authStorage';
import { showErrorToast, showValidationToast } from '@/utils/toast';

export default function LoginPage() {
  const [wiping, setWiping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');

    if (!email || !password) {
      showValidationToast('Enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const { token } = await loginUser({ email, password });
      saveToken(token);
      setWiping(true);
      window.setTimeout(() => navigate(ROUTES.LANDING), 800);
    } catch (err) {
      showErrorToast(err, 'auth');
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="enter" exit="exit">
      <BareLayout>
        <AuthShell
          side="right"
          title="Welcome back."
          subtitle="Pick up exactly where you left off — your decision journeys are saved and waiting."
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input label="Email"    name="email"    leftIcon={<FiMail />} placeholder="you@company.com" type="email" required />
            <Input label="Password" name="password" leftIcon={<FiLock />} placeholder="••••••••"        type="password" required />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-tertiary">
                <input type="checkbox" defaultChecked className="accent-[var(--brand-500)]" />
                Remember me
              </label>
            </div>

            <Button
              size="lg"
              rightIcon={<FiArrowRight />}
              fullWidth
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Enter HelpDesk'}
            </Button>
            <p className="mt-2 text-sm text-secondary">
              New to HelpDesk?{' '}
              <button
                type="button"
                className="link-anim text-[var(--brand-300)]"
                onClick={() => navigate(ROUTES.SIGNUP)}
              >
                Create an account
              </button>
            </p>
          </form>
        </AuthShell>

        <CinematicWipe active={wiping} />
      </BareLayout>
    </motion.div>
  );
}
