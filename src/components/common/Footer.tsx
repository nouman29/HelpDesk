import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FOOTER_NAV } from "@/constants/nav";
import { BRAND } from "@/constants/brand";
import { Logo } from "@/components/ui/Logo";
import { lenisScrollTo } from "@/hooks/useLenis";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--brand-400)]/40 to-transparent" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 aurora h-[420px] w-full max-w-205 opacity-30"
        style={{
          background: "radial-gradient(closest-side, #1f86ff, transparent 70%)",
        }}
      />

      <div className="mx-auto md:max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2 flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm text-secondary leading-relaxed">
              {BRAND.description} Built for the moments that matter.
            </p>
          </div>
          {FOOTER_NAV.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h4 className="mono text-[10px] uppercase tracking-[0.25em] text-tertiary">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2 text-sm">
                {col.items.map((it) => (
                  <li key={it.label}>
                    {it.href.startsWith("/") ? (
                      <Link
                        to={it.href}
                        className="link-anim text-secondary hover:text-primary"
                      >
                        {it.label}
                      </Link>
                    ) : (
                      <a
                        href={it.href}
                        onClick={(e) => {
                          e.preventDefault();
                          lenisScrollTo(it.href);
                        }}
                        className="link-anim text-secondary hover:text-primary"
                      >
                        {it.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex w-full items-center justify-center border-t border-white/5 pt-8 text-xs text-tertiary"
        >
          <p className="text-center">
            © {new Date().getFullYear()} {BRAND.name}. All decisions reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
