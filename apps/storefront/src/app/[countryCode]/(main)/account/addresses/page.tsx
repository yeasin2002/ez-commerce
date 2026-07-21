"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  IconMapPin,
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { mockAddresses, MockAddress } from "@/data/account.data";
import { CommonInput } from "@/components/shared";
import { Button } from "@/components/ui/button";

let nextId = 100;
const generateId = () => {
  nextId++;
  return `addr-mock-${nextId}`;
};

const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-]{8,20}$/, "Please enter a valid phone number"),
  address1: z
    .string()
    .min(1, "Address is required")
    .min(5, "Please enter a descriptive address"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Division is required"),
  postalCode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<MockAddress[]>(mockAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<MockAddress | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const handleEditClick = (address: MockAddress) => {
    setEditingAddress(address);
    setIsEditing(true);
    reset({
      fullName: address.fullName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefaultShipping: address.isDefaultShipping || false,
      isDefaultBilling: address.isDefaultBilling || false,
    });
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setIsEditing(true);
    reset({
      fullName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Bangladesh",
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
  };

  const onSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      // Mock update
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...data } : addr,
        ),
      );
    } else {
      // Mock append new
      const newAddress: MockAddress = {
        id: generateId(),
        ...data,
        type: "home",
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    setIsEditing(false);
  };

  const handleDeleteClick = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-hairline-soft flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display uppercase tracking-wider text-ink dark:text-canvas">
            Addresses
          </h1>
          <p className="text-xs text-mute mt-1 font-sans">
            Manage your saved shipping and billing addresses.
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={handleAddNewClick}
            className="rounded-full bg-ink hover:bg-charcoal text-canvas px-4 py-2 text-xs font-semibold uppercase tracking-wider border-none h-10 cursor-pointer font-sans flex items-center gap-1.5"
          >
            <IconPlus size={14} />
            <span>Add New Address</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        /* Edit or Add New Form Panel */
        <div className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-6 space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-hairline-soft/80 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-canvas font-sans">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-mute hover:text-ink dark:hover:text-canvas transition-colors cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CommonInput
                label="Full Name"
                placeholder="Receiver name"
                error={errors.fullName}
                {...register("fullName")}
              />
              <CommonInput
                label="Phone Number"
                placeholder="Receiver phone number"
                error={errors.phone}
                {...register("phone")}
              />
            </div>

            {/* Address Line 1 & Line 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CommonInput
                label="Address Line 1"
                placeholder="House, road, block, area"
                error={errors.address1}
                {...register("address1")}
              />
              <CommonInput
                label="Address Line 2 (Optional)"
                placeholder="Apartment, unit, suite"
                error={errors.address2}
                {...register("address2")}
              />
            </div>

            {/* City, State/Division, Postcode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CommonInput
                label="City"
                placeholder="City"
                error={errors.city}
                {...register("city")}
              />
              <CommonInput
                label="State / Division"
                placeholder="State or Division"
                error={errors.state}
                {...register("state")}
              />
              <CommonInput
                label="Postal Code"
                placeholder="Postcode"
                error={errors.postalCode}
                {...register("postalCode")}
              />
            </div>

            {/* Country */}
            <CommonInput
              label="Country"
              placeholder="Country"
              error={errors.country}
              {...register("country")}
            />

            {/* Options boxes */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center group cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="peer h-4.5 w-4.5 appearance-none rounded border border-border bg-canvas checked:bg-ink checked:border-ink focus:outline-none transition-all cursor-pointer"
                  {...register("isDefaultShipping")}
                />
                <span className="text-xs font-semibold text-ink dark:text-canvas ml-2.5 font-sans">
                  Set as default shipping address
                </span>
              </label>

              <label className="flex items-center group cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="peer h-4.5 w-4.5 appearance-none rounded border border-border bg-canvas checked:bg-ink checked:border-ink focus:outline-none transition-all cursor-pointer"
                  {...register("isDefaultBilling")}
                />
                <span className="text-xs font-semibold text-ink dark:text-canvas ml-2.5 font-sans">
                  Set as default billing address
                </span>
              </label>
            </div>

            {/* Actions button */}
            <div className="flex gap-3 pt-4 border-t border-hairline-soft/85">
              <Button
                type="submit"
                className="rounded-full bg-ink hover:bg-charcoal text-canvas px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-none h-11 cursor-pointer font-sans"
              >
                Save Address
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full bg-cloud dark:bg-zinc-900 text-ink dark:text-canvas hover:bg-cloud/70 dark:hover:bg-zinc-800 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-none h-11 cursor-pointer font-sans"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* Addresses Grid List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-canvas dark:bg-zinc-950 border border-hairline-soft rounded-xl p-5 space-y-4 flex flex-col justify-between"
            >
              {/* Card content address details */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {address.isDefaultShipping && (
                    <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-sans">
                      Default Shipping
                    </span>
                  )}
                  {address.isDefaultBilling && (
                    <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-sans">
                      Default Billing
                    </span>
                  )}
                  {!address.isDefaultShipping && !address.isDefaultBilling && (
                    <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-mute bg-cloud px-2 py-0.5 rounded-full font-sans">
                      Home
                    </span>
                  )}
                </div>

                <div className="text-xs text-ink/80 dark:text-canvas/80 font-sans leading-relaxed space-y-0.5">
                  <p className="font-bold text-ink dark:text-canvas">
                    {address.fullName}
                  </p>
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="mt-1 text-mute">{address.phone}</p>
                </div>
              </div>

              {/* Action buttons (Edit/Delete) */}
              <div className="flex items-center gap-4 pt-3 border-t border-hairline-soft/60">
                <button
                  onClick={() => handleEditClick(address)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-mute hover:text-ink dark:hover:text-canvas transition-colors font-sans cursor-pointer"
                >
                  <IconEdit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(address.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-sale hover:text-red-700 transition-colors font-sans cursor-pointer"
                >
                  <IconTrash size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {/* Dotted empty placeholder to quickly add card */}
          <div
            onClick={handleAddNewClick}
            className="border-2 border-dashed border-hairline-soft hover:border-ink dark:hover:border-canvas rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors text-mute hover:text-ink dark:hover:text-canvas gap-2 py-10"
          >
            <IconMapPin size={24} className="opacity-60" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold font-sans">Add new address</p>
              <p className="text-[10px] opacity-75 font-sans leading-tight">
                Make checking out faster
              </p>
            </div>
            <Button
              type="button"
              className="mt-2 rounded-full h-8 px-4 text-[10px] font-bold uppercase tracking-wider bg-ink hover:bg-charcoal text-canvas border-none"
            >
              Add Address
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
