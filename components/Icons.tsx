export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={diagonal ? { transform: "rotate(-45deg)" } : undefined}><path d="M4 12h15M12 5l7 7-7 7" /></svg>;
}
export function Asterisk() {
  return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 0v64M0 32h64M9.4 9.4l45.2 45.2M9.4 54.6L54.6 9.4" stroke="currentColor" strokeWidth="9" /></svg>;
}
