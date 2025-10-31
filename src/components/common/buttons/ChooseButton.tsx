import { Send } from "lucide-react";

interface ChooseButtonProps {
  text?: string;
  onClick?: () => void;
}

export default function ChooseButton({ text = "Choose", onClick }: ChooseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-full 
      bg-[var(--color-card-1)] text-black text-sm font-medium 
      shadow-md hover:shadow-lg transition-all duration-200"
    >
      {text}
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white">
        <Send size={16} />
      </span>
    </button>
  );
}
