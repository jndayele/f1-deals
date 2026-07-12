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
    const payload = {
      ...values,
      year: Number(values.year),
      price: Number(values.price),
      mileage: values.mileage ? Number(values.mileage) : undefined,
    };

    if (isEdit) {
      await updateCar.mutateAsync({ id, data: payload });
      toast({ title: "Car updated successfully" });
    } else {
      await createCar.mutateAsync(payload);
      toast({ title: "Car added successfully" });
    }
    setSaving(false);
    navigate("/cars");
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
            {isEdit ? "Save Changes" : "Add Car"}
          </Button>
        </div>
      </form>
    </div>
  );
}