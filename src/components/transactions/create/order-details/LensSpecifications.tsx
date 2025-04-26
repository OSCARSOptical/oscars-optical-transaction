
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LensSpecificationsProps {
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
  disabled: boolean;
  readOnly: boolean;
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
  disabled,
  readOnly
}: LensSpecificationsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <Label htmlFor="refractiveIndex" className="text-xs text-muted-foreground capitalize">Refractive index</Label>
        <Select 
          value={refractiveIndex}
          onValueChange={onRefractiveIndexChange}
          disabled={readOnly || disabled}
        >
          <SelectTrigger 
            id="refractiveIndex"
            className={cn(readOnly && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select refractive index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N/A">N/A</SelectItem>
            <SelectItem value="1.56">1.56</SelectItem>
            <SelectItem value="1.61">1.61</SelectItem>
            <SelectItem value="1.67">1.67</SelectItem>
            <SelectItem value="1.74">1.74</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="lensType" className="text-xs text-muted-foreground capitalize">Lens type</Label>
        <Select 
          value={lensType}
          onValueChange={onLensTypeChange}
          disabled={readOnly || disabled}
        >
          <SelectTrigger 
            id="lensType"
            className={cn(readOnly && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select lens type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N/A">N/A</SelectItem>
            <SelectItem value="SV">SV</SelectItem>
            <SelectItem value="KK">KK</SelectItem>
            <SelectItem value="Prog">Prog</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="lensCoating" className="text-xs text-muted-foreground capitalize">Lens coating</Label>
        <Select 
          value={lensCoating}
          onValueChange={onLensCoatingChange}
          disabled={readOnly || disabled}
        >
          <SelectTrigger 
            id="lensCoating"
            className={cn(readOnly && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select lens coating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N/A">N/A</SelectItem>
            <SelectItem value="UC">UC</SelectItem>
            <SelectItem value="MC">MC</SelectItem>
            <SelectItem value="BB">BB</SelectItem>
            <SelectItem value="TRG">TRG</SelectItem>
            <SelectItem value="BB TRG">BB + TRG</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="tint" className="text-xs text-muted-foreground capitalize">Tint</Label>
        <Select 
          value={tint}
          onValueChange={onTintChange}
          disabled={readOnly || disabled}
        >
          <SelectTrigger 
            id="tint"
            className={cn(readOnly && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select tint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N/A">N/A</SelectItem>
            <SelectItem value="One-Tone">One-tone</SelectItem>
            <SelectItem value="Two-Tone">Two-tone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="frameType" className="text-xs text-muted-foreground capitalize">Frame type</Label>
        <Select 
          value={frameType}
          onValueChange={onFrameTypeChange}
          disabled={readOnly || disabled}
        >
          <SelectTrigger 
            id="frameType"
            className={cn(readOnly && "bg-muted cursor-default")}
          >
            <SelectValue placeholder="Select frame type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N/A">N/A</SelectItem>
            <SelectItem value="Full Rim">Full rim</SelectItem>
            <SelectItem value="Semi Rim">Semi rim</SelectItem>
            <SelectItem value="Rimless">Rimless</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LensSpecifications;
