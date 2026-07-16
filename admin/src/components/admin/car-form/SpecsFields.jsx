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

const TRANSMISSIONS = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Van", "Truck", "Crossover"];
const CONDITIONS = [
  { value: "New", label: "New" },
  { value: "SlightlyUsed", label: "Slightly Used" }
];

export default function SpecsFields({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
        Specifications
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="e.g. 15000"
            value={values.mileage || ""}
            onChange={(e) => update("mileage", parseInt(e.target.value) || "")}
          />
        </div>

        <div>
          <Label>Transmission</Label>
          <Select value={values.transmission || ""} onValueChange={(v) => update("transmission", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISSIONS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fuel Type</Label>
          <Select value={values.fuel_type || ""} onValueChange={(v) => update("fuel_type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Body Type</Label>
          <Select value={values.body_type || ""} onValueChange={(v) => update("body_type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Condition</Label>
        <Select value={values.condition || ""} onValueChange={(v) => update("condition", v)}>
          <SelectTrigger className="w-full md:w-1/2">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}