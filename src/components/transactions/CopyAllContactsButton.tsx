
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyAllContactsButtonProps {
  allContactNumbers: string;
}

export function CopyAllContactsButton({ allContactNumbers }: CopyAllContactsButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    if (allContactNumbers.length === 0) return;
    navigator.clipboard.writeText(allContactNumbers);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  if (!allContactNumbers) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-1 h-5 w-5 p-0 rounded hover:bg-gray-100 focus:outline-none"
      title="Copy all contact numbers"
      onClick={handleCopyAll}
      type="button"
      aria-label="Copy all contact numbers"
    >
      <Copy className={`w-4 h-4 ${copied ? "text-green-500" : "text-gray-400"}`} />
    </Button>
  );
}
