
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Moon, 
  RefreshCw, 
  Palette, 
  Droplets, 
  Upload,
  InfoIcon,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ViewToolbarProps {
  isDarkMode: boolean;
  isInverted: boolean;
  isSixShades: boolean;
  isCoolTone: boolean;
  onToggleDarkMode: () => void;
  onToggleInverted: () => void;
  onToggleSixShades: () => void;
  onToggleCoolTone: () => void;
  onOpenUploadModal: () => void;
  position?: "left" | "right" | "top" | "bottom";
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function ViewToolbar({
  isDarkMode,
  isInverted,
  isSixShades,
  isCoolTone,
  onToggleDarkMode,
  onToggleInverted,
  onToggleSixShades,
  onToggleCoolTone,
  onOpenUploadModal,
  position = "right",
  isSidebarOpen,
  onToggleSidebar
}: ViewToolbarProps) {
  const { toast } = useToast();
  
  const toolbarClassName = cn(
    "fixed z-10 glass-panel p-2 rounded-lg transition-all duration-300",
    {
      "top-4 right-4 flex-col": position === "right",
      "top-4 left-20 flex-row": position === "top" && isSidebarOpen,
      "top-4 left-4 flex-row": position === "top" && !isSidebarOpen,
    }
  );

  const infoHelpToast = () => {
    toast({
      title: "About Splat View Explorer",
      description: "A 3D viewer for neural radiance point clouds (.splat files). Use the toolbar to adjust view settings and upload new models.",
    });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className={toolbarClassName}>
        <div className="flex flex-col space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("toolbar-button", { "active": isDarkMode })}
                onClick={onToggleDarkMode}
              >
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="sr-only">Dark Mode</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Toggle Dark Mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("toolbar-button", { "active": isInverted })}
                onClick={onToggleInverted}
              >
                <RefreshCw className="h-5 w-5" />
                <span className="sr-only">Invert Colors</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Invert Colors</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("toolbar-button", { "active": isSixShades })}
                onClick={onToggleSixShades}
              >
                <Palette className="h-5 w-5" />
                <span className="sr-only">6 Shades</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>6-Shade Coloring</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("toolbar-button", { "active": isCoolTone })}
                onClick={onToggleCoolTone}
              >
                <Droplets className="h-5 w-5" />
                <span className="sr-only">Cool Tone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Cool Tone Coloring</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-px bg-border my-1"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon" 
                className="toolbar-button"
                onClick={onOpenUploadModal}
              >
                <Upload className="h-5 w-5" />
                <span className="sr-only">Upload Files</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Upload TIF/TIFF Files</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="toolbar-button"
                onClick={infoHelpToast}
              >
                <InfoIcon className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Help & Information</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
