import React, { useState, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Upload, X, GripVertical, Image, Film, Star } from "lucide-react";

export default function MediaUploader({ value = [], onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      if (!files.length) return;
      const newMedia = [];

      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        if (!isVideo && !isImage) continue;

        // Create a local preview URL and store the raw File object
        // so CarForm can upload it later.
        newMedia.push({
          url: URL.createObjectURL(file), // temporary local preview
          type: isVideo ? "video" : "image",
          file, // the raw File object to upload later
          isNew: true, // flag to indicate it needs to be uploaded
        });
      }

      onChange([...value, ...newMedia]);
    },
    [value, onChange]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(value);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onChange(items);
  };

  const removeItem = (index) => {
    // If we're removing a preview URL, we should clean it up to prevent memory leaks
    const itemToRemove = value[index];
    if (itemToRemove.isNew && itemToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(itemToRemove.url);
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">
          Drop photos or videos here, or click to browse
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, PNG, MP4, MOV
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files))}
        />
      </div>

      {value.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="media-list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3"
              >
                {value.map((item, index) => {
                  // A unique key is crucial for drag-and-drop.
                  // For existing items we use their ID or URL. For new items we use the URL blob string.
                  const uniqueKey = item.id ? `media-${item.id}` : `new-${item.url}`;
                  return (
                    <Draggable key={uniqueKey} draggableId={uniqueKey} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group w-28 h-28 rounded-lg overflow-hidden border-2 ${
                            index === 0 ? "border-red-500" : "border-gray-200"
                          } ${snapshot.isDragging ? "shadow-lg ring-2 ring-red-300" : ""}`}
                        >
                          {item.type === "video" ? (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                              <Film className="w-8 h-8 text-white/60" />
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}

                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5" /> Cover
                            </div>
                          )}
                          
                          {item.isNew && (
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                              New
                            </div>
                          )}

                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-1 right-7 bg-black/50 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {value.length > 0 && (
        <p className="text-xs text-gray-500">
          Drag to reorder. The first image is the cover photo.
        </p>
      )}
    </div>
  );
}