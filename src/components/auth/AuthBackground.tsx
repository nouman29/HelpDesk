import { AuroraBlob } from '@/components/animations/AuroraBlob';

/** Cinematic backdrop for /signup and /login. */
export function AuthBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0"
           style={{
             background:
               'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(31,134,255,0.18), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(139,108,255,0.14), transparent 60%)',
           }} />
      <AuroraBlob className="-left-40 top-[12%]" color="#1f86ff" size={520} />
      <AuroraBlob className="-right-40 bottom-[18%]" color="#8b6cff" size={520} />
      <div className="absolute inset-0 opacity-50"
           style={{
             backgroundImage:
               'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
             backgroundSize: '60px 60px',
             maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, #000 30%, transparent 80%)',
             WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, #000 30%, transparent 80%)',
           }} />
    </div>
  );
}
