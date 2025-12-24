import { Tool } from '@/data/tools';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No tools found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {tools.map((tool, index) => (
        <ToolCard key={tool.id} tool={tool} index={index} />
      ))}
    </div>
  );
}
