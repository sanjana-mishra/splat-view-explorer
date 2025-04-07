import React, { useState, useEffect } from "react";
import { ModelSidebar } from "@/components/ModelSidebar";
import { ViewToolbar } from "@/components/ViewToolbar";
import { UploadModal } from "@/components/UploadModal";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

// Mock data for models with URLs
const initialModels = [
  { 
    id: "1", 
    name: "Amplifier", 
    url: "https://dl.dropboxusercontent.com/scl/fi/5oghekx1kt1jnesfdbw3q/amplifier_splat.splat?rlkey=sd0ej1s27wxjljc2akcevj3op&st=xjx3pr8v&raw=1" 
  },
  { 
    id: "2", 
    name: "Ammo Can", 
    url: "https://dl.dropboxusercontent.com/scl/fi/1d8w1gg353wmsh2s73eq7/ammo-can.splat?rlkey=3srsa4c4wzln41rjeq03ztt3x&st=0r6l8cnl&raw=1" 
  },
  { 
    id: "3", 
    name: "Colored Radios", 
    url: "https://dl.dropboxusercontent.com/scl/fi/k6icqxwspzpx3ljljnwf7/1layer360_latest.splat?rlkey=l4dd3xdwmer08pm2qqlnvhdzb&e=1&st=hfywmlba&raw=1" 
  },
  { 
    id: "4", 
    name: "Colored Cooler Bomb", 
    url: "https://dl.dropboxusercontent.com/scl/fi/b4wusqhm8g20h6vs7mn5s/6-shades_latest.splat?rlkey=7kol3w27o2ce5fng9nfcbl5cz&st=x76j3f3y&raw=1" 
  },
  { 
    id: "5", 
    name: "ROI Battery Charger", 
    url: "https://dl.dropboxusercontent.com/scl/fi/ufywmhnp3gzlxavbh09g3/ROI-Battery-Charger.splat?rlkey=exay4eug4i8s5yq6g37ng6qnd&st=1i3w7c1o&raw=1" 
  },
  { id: "6", name: "XR150", url: "" },
  { id: "7", name: "ROI USB WiFi", url: "" },
  { id: "8", name: "ROI Salt and Pepper", url: "" },
];

const Index = () => {
  // State for models with ability to remove them
  const [models, setModels] = useState(initialModels);
  
  // State for sidebar and model selection
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  // State for view settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [isSixShades, setIsSixShades] = useState(false);
  const [isCoolTone, setIsCoolTone] = useState(false);
  
  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const { toast } = useToast();

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle model selection
  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    
    // Find the selected model for notifications
    const model = models.find(m => m.id === modelId);
    if (model) {
      // In a real application, this would trigger the loading of the 3D model
      toast({
        title: "Model Selected",
        description: `Loading ${model.name} model...`,
      });
      
      console.log(`Loading model: ${model.name}`);
    }
  };

  // Handle opening the model URL
  const handleOpenModelUrl = (url: string) => {
    if (!url) {
      toast({
        title: "No URL Available",
        description: "This model doesn't have a valid URL.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Opening URL from Index:", url);
    
    try {
      // Use a direct approach to open the URL
      const newWindow = window.open(url, '_blank');
      
      // For security, avoid directly manipulating the new window
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Popup was blocked, inform the user
        toast({
          title: "Popup Blocked",
          description: "The browser blocked opening the link. Please allow popups for this site.",
          variant: "destructive"
        });
      } else {
        // Successfully opened
        toast({
          title: "Opening Model URL",
          description: "The model URL has been opened in a new tab."
        });
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      toast({
        title: "Error Opening URL",
        description: "Failed to open the URL. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle removing a model
  const handleRemoveModel = (modelId: string) => {
    // Find the model to remove
    const modelToRemove = models.find(m => m.id === modelId);
    
    if (modelToRemove) {
      // Remove the model from the state
      setModels(models.filter(m => m.id !== modelId));
      
      // Show toast notification
      toast({
        title: "Model Removed",
        description: `Removed ${modelToRemove.name} from the gallery.`,
      });
      
      // If the currently selected model is being removed, clear selection
      if (selectedModel === modelId) {
        setSelectedModel(null);
      }
    }
  };

  // Handle file uploads
  const handleConfirmUpload = (files: File[]) => {
    // In a real application, this would process the uploaded files
    console.log("Files to upload:", files);
    
    // For this demo, we'll just show a toast
    if (files.length > 0) {
      toast({
        title: "Files Uploaded",
        description: `Successfully processed ${files.length} files.`,
      });
    }
  };

  // Communicate view setting changes to external rendering engine
  useEffect(() => {
    // In a real application, these would trigger calls to the rendering engine
    console.log("View settings updated:", {
      isDarkMode,
      isInverted,
      isSixShades,
      isCoolTone
    });
    
    // Here you would typically call functions that update the canvas rendering
  }, [isDarkMode, isInverted, isSixShades, isCoolTone]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Canvas container (would be handled by external script) */}
      <div id="canvas-container" className="canvas-container" />
      
      {/* Model selection sidebar */}
      <ModelSidebar 
        models={models}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        onOpenModelUrl={handleOpenModelUrl}
        onRemoveModel={handleRemoveModel}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* View controls toolbar */}
      <ViewToolbar 
        isDarkMode={isDarkMode}
        isInverted={isInverted}
        isSixShades={isSixShades}
        isCoolTone={isCoolTone}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleInverted={() => setIsInverted(!isInverted)}
        onToggleSixShades={() => setIsSixShades(!isSixShades)}
        onToggleCoolTone={() => setIsCoolTone(!isCoolTone)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        position="right"
      />
      
      {/* Upload modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onConfirmUpload={handleConfirmUpload}
      />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Index;
