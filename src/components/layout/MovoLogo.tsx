export function MovoLogo({ className = 'header__logo' }: { className?: string }) {
  return (
    <img src={`${import.meta.env.BASE_URL}MOVO-logo.png`} alt="Movo logo" className={className} />
  );
}
