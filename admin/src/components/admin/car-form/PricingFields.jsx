import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PricingFields({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        Pricing & Description
      </h3>

      <div>
        <Label htmlFor="price">Price (GHS)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
            GHS
          </span>
          <Input
            id="price"
            type="number"
            className="pl-14"
            placeholder="e.g. 285000"
            value={values.price || ""}
            onChange={(e) => update("price", parseFloat(e.target.value) || "")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Describe the car's features, condition, and selling points..."
          value={values.description || ""}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>
    </div>
  );
}