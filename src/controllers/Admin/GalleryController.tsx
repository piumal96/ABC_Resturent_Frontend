import { useState, useEffect } from "react";
import { getGalleryImages, uploadImage, deleteImage } from "@/services/api";

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  location: string;
}

export const useGalleryController = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryImages = await getGalleryImages();
        setImages(
          galleryImages.map((image: any) => ({
            id: image._id,
            url: image.imageUrl,
            caption: image.title,
            location: image.description,
          }))
        );
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageUpload = async () => {
    if (newImage && newCaption && newLocation) {
      try {
        const response = await uploadImage(newImage, newCaption, newLocation);
        const newGalleryImage: GalleryImage = {
          id: response.image.id,
          url: response.image.imageUrl,
          caption: newCaption,
          location: newLocation,
        };

        setImages([...images, newGalleryImage]);

        setNewImage(null);
        setSelectedImagePreview(null);
        setNewCaption("");
        setNewLocation("");

        console.log("Image uploaded successfully:", newGalleryImage);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (imageToDelete) {
      try {
        const response = await deleteImage(imageToDelete);
        if (response.success) {
          setImages((prevImages) => prevImages.filter((image) => image.id !== imageToDelete));
          console.log(`Deleted image with id: ${imageToDelete}`);
        } else {
          console.error("Failed to delete image:", response.message);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      } finally {
        setDeleteDialogOpen(false);
        setImageToDelete(null);
      }
    }
  };

  const handleImageSelection = (file: File | null) => {
    if (file) {
      setNewImage(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    } else {
      setNewImage(null);
      setSelectedImagePreview(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteDialogOpen(true);
    setImageToDelete(id);
  };

  return {
    images,
    newImage,
    newCaption,
    newLocation,
    selectedImagePreview,
    deleteDialogOpen,
    handleImageUpload,
    handleDelete,
    handleImageSelection,
    openDeleteDialog,
    setNewCaption,
    setNewLocation,
    setDeleteDialogOpen,
  };
};
