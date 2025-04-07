
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, XCircle, ChevronLeft, Box, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModelItem = {
  id: string;
  name: string;
  url: string; // Added URL for the model
  thumbnail?: string;
  category?: string;
};

interface ModelSidebarProps {
  models: ModelItem[];
  selectedModel: string | null;
  onSelectModel: (modelId: string) => void;
  onRemoveModel?: (modelId: string) => void; // Add ability to remove models
  isOpen: boolean;
  onToggle: () => void;
}

export function ModelSidebar({
  models,
  selectedModel,
  onSelectModel,
  onRemoveModel,
  isOpen,
  onToggle,
}: ModelSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModels, setFilteredModels] = useState(models);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModels(models);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      setFilteredModels(
        models.filter((model) =>
          model.name.toLowerCase().includes(lowercaseQuery)
        )
      );
    }
  }, [searchQuery, models]);

  const highlightMatch = (text: string) => {
    if (searchQuery.trim() === "") return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={index} className="search-highlight">{part}</span> : part
    );
  };

  const handleRemoveModel = (e: React.MouseEvent, modelId: string) => {
    e.stopPropagation(); // Prevent triggering selection when clicking remove
    if (onRemoveModel) {
      onRemoveModel(modelId);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn("sidebar-toggle transition-all duration-300", {
          "open": isOpen
        })}
        onClick={onToggle}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronLeft className={cn("h-5 w-5 transition-transform", {
          "rotate-180": !isOpen
        })} />
      </Button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-screen w-[280px] bg-sidebar shadow-lg border-r border-border transition-transform duration-300",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold flex items-center">
              <Box className="mr-2 h-5 w-5 text-splat" /> Model Gallery
            </h2>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                className="pl-9 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3">
              {filteredModels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No models found matching "{searchQuery}"
                </div>
              ) : (
                filteredModels.map((model) => (
                  <div key={model.id} className="relative mb-1 group">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start mb-1 font-normal hover:bg-accent rounded-md transition-colors",
                        {
                          "bg-primary/10 border-l-4 border-primary": model.id === selectedModel,
                        }
                      )}
                      onClick={() => onSelectModel(model.id)}
                    >
                      <div
                        className="model-thumbnail"
                        style={{ backgroundImage: model.thumbnail ? `url(${model.thumbnail})` : undefined }}
                      >
                        {!model.thumbnail && <Box className="h-5 w-5 m-auto mt-2.5 text-muted-foreground" />}
                      </div>
                      <span>{highlightMatch(model.name)}</span>
                    </Button>
                    
                    {onRemoveModel && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity remove-button"
                        onClick={(e) => handleRemoveModel(e, model.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {model.name}</span>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="p-3 border-t border-border text-xs text-muted-foreground">
            {models.length} models available
          </div>
        </div>
      </aside>
    </>
  );
}
