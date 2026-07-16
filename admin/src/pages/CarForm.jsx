import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BasicInfoFields from "@/components/admin/car-form/BasicInfoFields";
import SpecsFields from "@/components/admin/car-form/SpecsFields";
import PricingFields from "@/components/admin/car-form/PricingFields";
import MediaUploader from "@/components/admin/MediaUploader";
import { useCars, useCar } from "@/hooks/useCars";
import * as carsApi from "@/api/carsApi";

const INITIAL_VALUES = {
  title: "",
  make: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  transmission: "",
  fuel_type: "",
  body_type: "",
  condition: "",
  description: "",
  media: [],
  status: "active",
};

export default function CarForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCar, updateCar } = useCars();
  const { data: existingCar, isLoading: loadingCar } = useCar(id);

  const [values, setValues] = useState(INITIAL_VALUES);
  const [saving, setSaving] = useState(false);
  
  // Keep track of original media IDs so we know what was deleted during edit
  const [originalMediaIds, setOriginalMediaIds] = useState([]);

  useEffect(() => {
    if (isEdit && existingCar) {
      setValues({
        title: existingCar.title || "",
        make: existingCar.make || "",
        model: existingCar.model || "",
        year: existingCar.year || "",
        price: existingCar.price || "",
        mileage: existingCar.mileage || "",
        transmission: existingCar.transmission || "",
        fuel_type: existingCar.fuel_type || "",
        body_type: existingCar.body_type || "",
        condition: existingCar.condition || "",
        description: existingCar.description || "",
        media: existingCar.media || [],
        status: existingCar.status || "active",
      });
      setOriginalMediaIds((existingCar.media || []).map(m => m.id).filter(Boolean));
    }
  }, [isEdit, existingCar]);

  const handleChange = (partial) => {
    setValues((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.title || !values.make || !values.model || !values.year || !values.price || !values.condition) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the title, make, model, year, price, and condition.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    // Separate pure car data from media
    const payload = {
      ...values,
      year: Number(values.year),
      price: Number(values.price),
      mileage: values.mileage ? Number(values.mileage) : undefined,
    };
    delete payload.media; // backend expects media to be uploaded separately

    try {
      let carId = isEdit ? id : null;

      // 1. Save or Create the Car record
      if (isEdit) {
        await updateCar.mutateAsync({ id, data: payload });
      } else {
        const newCar = await createCar.mutateAsync(payload);
        carId = newCar.id;
      }

      // 2. Handle Media Syncing
      const currentMedia = values.media || [];
      const newFilesToUpload = currentMedia.filter(m => m.isNew && m.file).map(m => m.file);
      const currentMediaIds = currentMedia.map(m => m.id).filter(Boolean);

      // 2a. Delete any existing media the user removed
      if (isEdit) {
        const deletedMediaIds = originalMediaIds.filter(id => !currentMediaIds.includes(id));
        for (const mediaId of deletedMediaIds) {
          try {
            await carsApi.deleteCarMedia(carId, mediaId);
          } catch (err) {
            console.error(`Failed to delete media ${mediaId}`, err);
          }
        }
      }

      // 2b. Upload new files
      let finalMediaItems = [...currentMedia];
      if (newFilesToUpload.length > 0) {
        toast({ title: "Uploading media..." });
        const uploadedMediaObjects = await carsApi.uploadCarMedia(carId, newFilesToUpload);
        
        // We need to replace the local "blob" objects in finalMediaItems with the actual backend objects
        // to get their real IDs for reordering.
        let uploadIndex = 0;
        finalMediaItems = finalMediaItems.map(m => {
          if (m.isNew) {
            const uploaded = uploadedMediaObjects[uploadIndex++];
            return uploaded;
          }
          return m;
        });
      }

      // 2c. Reorder all media based on the final arrangement
      const finalOrderedIds = finalMediaItems.map(m => m.id).filter(Boolean);
      if (finalOrderedIds.length > 0) {
        await carsApi.reorderCarMedia(carId, finalOrderedIds);
      }

      toast({ title: isEdit ? "Car updated successfully" : "Car added successfully" });
      navigate("/cars");
      
    } catch (err) {
      console.error(err);
      toast({ 
        title: "Failed to save car", 
        description: err.response?.data?.error?.message || err.message, 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loadingCar) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/cars")}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Listing" : "Add New Car"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <BasicInfoFields values={values} onChange={handleChange} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <SpecsFields values={values} onChange={handleChange} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <PricingFields values={values} onChange={handleChange} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            Photos & Videos
          </h3>
          <MediaUploader
            value={values.media || []}
            onChange={(media) => handleChange({ media })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/cars")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : (isEdit ? "Save Changes" : "Add Car")}
          </Button>
        </div>
      </form>
    </div>
  );
}