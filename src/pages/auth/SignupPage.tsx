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
import { showErrorToast, showValidationToast } from '@/utils/toast';

export default function SignupPage() {
  const [wiping, setWiping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
      showValidationToast('Fill in all fields.');
      return;
    }
    if (password.length < 6) {
      showValidationToast('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      showValidationToast("Passwords don't match.");
      return;
    }

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
      showErrorToast(err, 'auth');
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
