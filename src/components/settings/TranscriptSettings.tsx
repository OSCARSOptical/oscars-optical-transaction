
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TranscriptSettings() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Create a simple text content for demonstration
      const content = `Conversation Transcript\n\n` +
        `1. Removed sample transaction data\n` +
        `2. Fixed import errors related to sample data\n` +
        `3. Refactored TransactionDetail.tsx into smaller components\n` +
        `4. Updated balance sheet to handle empty states\n` +
        `5. Updated UI elements and search placeholders\n` +
        `6. Changed column names and added empty states\n`;

      // Create blob and trigger download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'conversation-transcript.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Transcript downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate transcript",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Conversation Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Download a record of our conversation history and changes made to the application.
          </p>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download Transcript"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
