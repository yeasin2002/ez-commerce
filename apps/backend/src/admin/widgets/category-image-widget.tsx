import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Button, Text, toast } from "@medusajs/ui"
import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

const CategoryImageWidget = ({ data }: DetailWidgetProps<any>) => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch category with custom linked category_image
  const { data: categoryRes, isLoading } = useQuery({
    queryKey: ["product-category-extended", data.id],
    queryFn: () => sdk.client.fetch<{ product_category: any }>(`/admin/product-categories/${data.id}`, {
      query: {
        fields: "id,name,handle,category_image.*"
      }
    })
  })

  const category = categoryRes?.product_category
  const imageUrl = category?.category_image?.image_url

  // Upload image to Medusa
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("files", file)

      const res = await sdk.client.fetch<{ files: { url: string }[] }>("/admin/uploads", {
        method: "POST",
        body: formData
      })
      return res.files[0].url
    }
  })

  // Save image URL to our link table
  const saveImageMutation = useMutation({
    mutationFn: async (url: string) => {
      return sdk.client.fetch(`/admin/product-categories/${data.id}/image`, {
        method: "POST",
        body: { image_url: url }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-category-extended", data.id] })
      toast.success("Category image updated successfully")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update category image")
    }
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadImageMutation.mutateAsync(file)
      await saveImageMutation.mutateAsync(url)
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image")
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Container className="mt-6">
      <div className="flex items-center justify-between pb-4 border-b border-ui-border-base">
        <div>
          <Text size="small" leading="compact" weight="plus">
            Category Image
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-subtle mt-1">
            Upload an image to represent this category on the storefront.
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="small"
            variant="secondary"
            onClick={handleUploadClick}
            isLoading={uploadImageMutation.isPending || saveImageMutation.isPending}
          >
            {imageUrl ? "Change Image" : "Upload Image"}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center p-4 bg-ui-bg-subtle rounded-md border border-dashed border-ui-border-strong">
        {isLoading ? (
          <Text size="small" className="text-ui-fg-subtle">
            Loading category image...
          </Text>
        ) : imageUrl ? (
          <div className="relative group max-w-xs aspect-video w-full rounded-md overflow-hidden bg-ui-bg-base border border-ui-border-base">
            <img
              src={imageUrl}
              alt={data.name}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <Text size="small" className="text-ui-fg-subtle">
            No image uploaded yet.
          </Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.after",
})

export default CategoryImageWidget
