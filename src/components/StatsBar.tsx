import { tools, categories } from '@/data/tools';
import { Layers, Zap, Shield, Globe } from 'lucide-react';

export function StatsBar() {
  const uniqueChains = new Set(tools.flatMap((t) => t.chains)).size;
  const verifiedCount = tools.filter((t) => t.verified).length;

  const stats = [
    {
      icon: Layers,
      value: tools.length,
      label: 'Tools',
    },
    {
      icon: Zap,
      value: categories.length - 1, // minus 'all'
      label: 'Categories',
    },
    {
      icon: Globe,
      value: uniqueChains,
      label: 'Chains',
    },
    {
      icon: Shield,
      value: verifiedCount,
      label: 'Verified',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-card p-4 flex items-center gap-3 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
