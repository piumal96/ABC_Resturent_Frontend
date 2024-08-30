import React, { useState } from 'react';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container
} from '@mui/material';
import Layout from '@/components/Layout/Layout';
import { uploadImage } from '@/services/api'; // Import the uploadImage function

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  location: string;
}

const GalleryList: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    // Handle edit image action
    console.log(`Edit image with id: ${id}`);
  };

  const handleDelete = () => {
    if (imageToDelete) {
      setImages(images.filter((image) => image.id !== imageToDelete));
      console.log(`Delete image with id: ${imageToDelete}`);
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const handleImageUpload = async () => {
    if (newImage && newCaption && newLocation) {
      try {
        const response = await uploadImage(newImage, newCaption, newLocation); // Call API to upload image
        const newGalleryImage: GalleryImage = {
          id: response.image.id, 
          url: response.image.imageUrl, 
          caption: newCaption,
          location: newLocation,
        };

        setImages([...images, newGalleryImage]);

        // Reset form
        setNewImage(null);
        setSelectedImagePreview(null);
        setNewCaption('');
        setNewLocation('');

        console.log('Image uploaded successfully:', newGalleryImage);
      } catch (error) {
        console.error('Image upload failed:', error);
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

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Upload New Image
          </Typography>

          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image Caption"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  required
                  helperText="Please provide a caption for the image."
                  placeholder="Enter image caption"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                  helperText="Specify the location related to this image."
                  placeholder="Enter image location"
                />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ maxWidth: '300px' }}
                >
                  Select Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageSelection(e.target.files ? e.target.files[0] : null)}
                  />
                </Button>
                {selectedImagePreview && (
                  <Box mt={2}>
                    <Typography variant="subtitle1">Preview:</Typography>
                    <img src={selectedImagePreview} alt="Selected" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ maxWidth: '300px', mt: 2 }}
                  onClick={handleImageUpload}
                  disabled={!newImage || !newCaption || !newLocation}
                >
                  Upload Image
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {images.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="textSecondary" mt={2}>
              No images in the gallery yet. Start by uploading a new image.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.url}
                    alt={image.caption}
                    sx={{ borderRadius: '8px 8px 0 0' }}
                  />
                  <CardContent>
                    <Typography variant="h6">{image.caption}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {image.location}
                    </Typography>
                    <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button onClick={() => handleEdit(image.id)} variant="outlined" color="primary" sx={{ flexGrow: 1, mr: 1 }}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(image.id)}
                        variant="outlined"
                        color="secondary"
                        sx={{ flexGrow: 1, ml: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default GalleryList;
