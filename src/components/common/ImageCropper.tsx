
import { useState, useRef } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (blob: Blob) => void;
  onCancel: () => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropper({ imageUrl, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = 70;
    
    const crop = centerAspectCrop(width, height, 1);
    setCrop(crop);
    setCompletedCrop(crop);
  }
  
  const handleCrop = () => {
    if (!imgRef.current || !completedCrop) {
      return;
    }
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }
    
    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;
    
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    
    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }
      onCropComplete(blob);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">Drag to adjust your profile picture crop</p>
      
      <div className="max-w-md mx-auto">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          circularCrop
          className="max-h-[400px] mx-auto"
        >
          <img
            ref={imgRef}
            alt="Crop preview"
            src={imageUrl}
            onLoad={onImageLoad}
            className="max-h-[400px] mx-auto"
          />
        </ReactCrop>
      </div>
      
      <div className="flex justify-center gap-3 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleCrop}>
          Apply Crop
        </Button>
      </div>
    </div>
  );
}
