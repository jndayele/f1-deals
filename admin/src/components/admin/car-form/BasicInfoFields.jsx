import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAKES = [
  "Toyota", "Honda", "Mercedes-Benz", "BMW", "Audi", "Hyundai", "Kia",
  "Nissan", "Ford", "Chevrolet", "Volkswagen", "Lexus", "Mazda", "Subaru",
  "Land Rover", "Porsche", "Mitsubishi", "Peugeot", "Suzuki", "Other"
];

export default function BasicInfoFields({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        Basic Information
      </h3>

      <div>
        <Label htmlFor="title">Listing Title</Label>
        <Input
          id="title"
          placeholder="e.g. 2024 Toyota Camry XSE"
          value={values.title || ""}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Make</Label>
          <Select value={values.make || ""} onValueChange={(v) => update("make", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {MAKES.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            placeholder="e.g. Camry"
            value={values.model || ""}
            onChange={(e) => update("model", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder="e.g. 2024"
            value={values.year || ""}
            onChange={(e) => update("year", parseInt(e.target.value) || "")}
          />
        </div>
      </div>
    </div>
  );
}