
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileType, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface FileWithPreview {
  file: File;
  id: string; // Unique identifier for each file
  progress?: number; // Upload progress (0-100)
  error?: string; // Error message if upload fails
  status: 'pending' | 'uploading' | 'success' | 'error';
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpload: (files: File[]) => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onConfirmUpload
}: UploadModalProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter(file => {
        // Check file type: only TIF/TIFF allowed
        const isValidType = file.name.toLowerCase().endsWith('.tif') || 
                          file.name.toLowerCase().endsWith('.tiff');
        
        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a TIF/TIFF file.`,
            variant: "destructive"
          });
        }
        
        // Check if file already exists in the list
        const isDuplicate = files.some(existingFile => 
          existingFile.file.name === file.name && 
          existingFile.file.size === file.size
        );
        
        if (isDuplicate) {
          toast({
            title: "Duplicate file",
            description: `${file.name} is already in the upload list.`,
            variant: "destructive"
          });
        }
        
        return isValidType && !isDuplicate;
      })
      .map(file => ({
        file,
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending' as const
      }));
    
    // Check if total files would exceed limit
    if (files.length + newFiles.length > 10) {
      toast({
        title: "Too many files",
        description: "Maximum 10 files can be uploaded at once.",
        variant: "destructive"
      });
      
      // Only add files up to the limit
      const availableSlots = 10 - files.length;
      setFiles(prev => [...prev, ...newFiles.slice(0, availableSlots)]);
    } else {
      setFiles(prev => [...prev, ...newFiles]);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (idToRemove: string) => {
    setFiles(files.filter(file => file.id !== idToRemove));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one TIF/TIFF file to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    const filesToUpload = [...files];
    filesToUpload.forEach(file => {
      file.status = 'uploading';
      file.progress = 0;
    });
    setFiles(filesToUpload);
    
    // Simulate upload process with progress
    const simulateProgress = () => {
      setFiles(prevFiles => 
        prevFiles.map(file => {
          if (file.status === 'uploading') {
            const newProgress = (file.progress || 0) + Math.random() * 10;
            
            if (newProgress >= 100) {
              return {
                ...file,
                progress: 100,
                status: 'success'
              };
            }
            
            return {
              ...file,
              progress: newProgress
            };
          }
          return file;
        })
      );
      
      const allCompleted = files.every(file => 
        file.status === 'success' || file.status === 'error'
      );
      
      if (!allCompleted) {
        setTimeout(simulateProgress, 200);
      } else {
        // All files processed
        setTimeout(() => {
          const successFiles = files
            .filter(file => file.status === 'success')
            .map(file => file.file);
          
          onConfirmUpload(successFiles);
          setIsUploading(false);
          setFiles([]);
          onClose();
          
          toast({
            title: "Upload complete",
            description: `Successfully uploaded ${successFiles.length} file(s).`
          });
        }, 500);
      }
    };
    
    setTimeout(simulateProgress, 500);
  };

  const handleClickUploadZone = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isUploading ? undefined : onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Upload TIF/TIFF Files
          </DialogTitle>
          <DialogDescription>
            Upload TIF/TIFF files to visualize as 3D models. Maximum 10 files.
          </DialogDescription>
        </DialogHeader>
        
        <div
          className={cn("upload-zone", { "dragging": isDragging })}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUploadZone}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".tif,.tiff"
            onChange={handleFileInputChange}
          />
          <FileType className="mx-auto h-12 w-12 text-muted-foreground/70" />
          <p className="mt-2 text-sm font-medium">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Accepted formats: TIF, TIFF
          </p>
        </div>
        
        {files.length > 0 && (
          <ScrollArea className="max-h-[200px] overflow-auto">
            <div className="space-y-2">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-2 rounded-md bg-accent/50"
                >
                  <div className="flex items-center overflow-hidden flex-1 mr-2">
                    <div className="shrink-0">
                      {file.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {(file.status === 'pending' || file.status === 'uploading') && (
                        <FileType className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="ml-2 min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <Progress value={file.progress} className="h-1 mt-1" />
                      )}
                      {file.error && (
                        <p className="text-xs text-red-500 truncate">
                          {file.error}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isUploading && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 shrink-0" 
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
