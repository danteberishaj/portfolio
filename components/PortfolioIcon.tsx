export default function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <img src={`/icons/${name}.svg`} width="24" height="24" alt="" aria-hidden="true" className={`icon ${className}`} />;
}
