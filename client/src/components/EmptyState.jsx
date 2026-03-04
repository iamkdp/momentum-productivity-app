export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-display font-semibold text-white mb-1">{title}</h3>
      <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}