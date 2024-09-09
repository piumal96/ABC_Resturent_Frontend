// src/components/GalleryList.tsx
import React from "react";
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
  Container,
} from "@mui/material";
import Layout from "@/components/Layout/Layout";
import { useGalleryController } from "@/controllers/Admin/GalleryController";

const GalleryList: React.FC = () => {
  const {
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
  } = useGalleryController();

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ margin: "20px 0", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
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
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ maxWidth: "300px" }}
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
                    <img
                      src={selectedImagePreview}
                      alt="Selected"
                      style={{ width: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "8px" }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ maxWidth: "300px", mt: 2 }}
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
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="textSecondary" mt={2}>
              No images in the gallery yet. Start by uploading a new image.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <Card sx={{ width: "100%", maxWidth: "300px", height: "100%", boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.url}
                    alt={image.caption}
                    sx={{ objectFit: "cover", height: "200px", borderRadius: "8px 8px 0 0" }}
                  />
                  <CardContent sx={{ padding: "16px" }}>
                    <Typography variant="h6">{image.caption}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {image.location}
                    </Typography>
                    <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Button onClick={() => openDeleteDialog(image.id)} variant="outlined" color="primary">
                        Edit
                      </Button>
                      <Button onClick={() => openDeleteDialog(image.id)} variant="outlined" color="secondary">
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
