
import React, { useState, useEffect } from "react";
import { ModelSidebar } from "@/components/ModelSidebar";
import { ViewToolbar } from "@/components/ViewToolbar";
import { UploadModal } from "@/components/UploadModal";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

// Mock data for models
const mockModels = [
  { id: "1", name: "Amplifier" },
  { id: "2", name: "Ammo Can" },
  { id: "3", name: "Colored Radios" },
  { id: "4", name: "Colored Cooler Bomb" },
  { id: "5", name: "ROI Battery Charger" },
  { id: "6", name: "XR150" },
  { id: "7", name: "ROI USB WiFi" },
  { id: "8", name: "ROI Salt and Pepper" },
];

const Index = () => {
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
    
    // Find the selected model name
    const model = mockModels.find(m => m.id === modelId);
    if (model) {
      // In a real application, this would trigger the loading of the 3D model
      // For this demo, we'll just show a toast
      toast({
        title: "Model Selected",
        description: `Loading ${model.name} model...`,
      });
      
      // You would typically call an external function here to load the model into the canvas
      console.log(`Loading model: ${model.name}`);
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
        models={mockModels}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
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
