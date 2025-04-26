
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LensSpecificationProps {
  refractiveIndex: string;
  lensType: string;
  lensCoating: string;
  tint: string;
  frameType: string;
  onRefractiveIndexChange: (value: string) => void;
  onLensTypeChange: (value: string) => void;
  onLensCoatingChange: (value: string) => void;
  onTintChange: (value: string) => void;
  onFrameTypeChange: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const LensSpecifications = ({
  refractiveIndex,
  lensType,
  lensCoating,
  tint,
  frameType,
  onRefractiveIndexChange,
  onLensTypeChange,
  onLensCoatingChange,
  onTintChange,
  onFrameTypeChange,
  disabled = false,
  readOnly = false
}: LensSpecificationProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <Label htmlFor="refractiveIndex" className="text-xs text-muted-foreground">Refractive Index</Label>
        <Select 
          value={refractiveIndex}
          onValueChange={onRefractiveIndexChange}
          disabled={disabled || readOnly}
        >
          <SelectTrigger 
            id="refractiveIndex"
            className={cn((disabled || readOnly) && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select Refractive Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1.50">1.50</SelectItem>
            <SelectItem value="1.53">1.53</SelectItem>
            <SelectItem value="1.56">1.56</SelectItem>
            <SelectItem value="1.59">1.59</SelectItem>
            <SelectItem value="1.60">1.60</SelectItem>
            <SelectItem value="1.67">1.67</SelectItem>
            <SelectItem value="1.74">1.74</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="lensType" className="text-xs text-muted-foreground">Lens Type</Label>
        <Select 
          value={lensType}
          onValueChange={onLensTypeChange}
          disabled={disabled || readOnly}
        >
          <SelectTrigger 
            id="lensType"
            className={cn((disabled || readOnly) && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select Lens Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single Vision">Single Vision</SelectItem>
            <SelectItem value="Bifocal">Bifocal</SelectItem>
            <SelectItem value="Progressive">Progressive</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="lensCoating" className="text-xs text-muted-foreground">Lens Coating</Label>
        <Select 
          value={lensCoating}
          onValueChange={onLensCoatingChange}
          disabled={disabled || readOnly}
        >
          <SelectTrigger 
            id="lensCoating"
            className={cn((disabled || readOnly) && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select Lens Coating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Standard">Standard</SelectItem>
            <SelectItem value="Anti-Reflective">Anti-Reflective</SelectItem>
            <SelectItem value="Blue Cut">Blue Cut</SelectItem>
            <SelectItem value="Photochromic">Photochromic</SelectItem>
            <SelectItem value="Polarized">Polarized</SelectItem>
            <SelectItem value="Transition">Transition</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="tint" className="text-xs text-muted-foreground">Tint</Label>
        <Select 
          value={tint}
          onValueChange={onTintChange}
          disabled={disabled || readOnly}
        >
          <SelectTrigger 
            id="tint"
            className={cn((disabled || readOnly) && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select Tint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="One-Tone">One-Tone</SelectItem>
            <SelectItem value="Two-Tone">Two-Tone</SelectItem>
            <SelectItem value="Gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="frameType" className="text-xs text-muted-foreground">Frame Type</Label>
        <Select 
          value={frameType}
          onValueChange={onFrameTypeChange}
          disabled={disabled || readOnly}
        >
          <SelectTrigger 
            id="frameType"
            className={cn((disabled || readOnly) && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select Frame Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full Frame">Full Frame</SelectItem>
            <SelectItem value="Semi-Rimless">Semi-Rimless</SelectItem>
            <SelectItem value="Rimless">Rimless</SelectItem>
            <SelectItem value="Supra">Supra</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LensSpecifications;
