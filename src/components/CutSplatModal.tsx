
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CutSplatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (angle: number) => void;
}

export function CutSplatModal({ isOpen, onClose, onConfirm }: CutSplatModalProps) {
  const [angle, setAngle] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAngle(value);
    setError("");
  };

  const handleConfirm = () => {
    const numericAngle = parseFloat(angle);
    
    if (isNaN(numericAngle)) {
      setError("Please enter a valid number");
      return;
    }
    
    if (numericAngle < 0 || numericAngle > 360) {
      setError("Angle must be between 0 and 360 degrees");
      return;
    }
    
    onConfirm(numericAngle);
    handleClose();
  };

  const handleClose = () => {
    setAngle("0");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cut Splat</DialogTitle>
          <DialogDescription>
            Enter the angle (0-360 degrees) for the splat cut operation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="angle" className="text-right">
              Angle
            </Label>
            <div className="col-span-3">
              <Input
                id="angle"
                type="number"
                min="0"
                max="360"
                step="0.1"
                value={angle}
                onChange={handleAngleChange}
                placeholder="Enter angle (0-360)"
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Apply Cut
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
