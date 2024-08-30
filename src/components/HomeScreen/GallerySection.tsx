import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Modal, CircularProgress, Skeleton } from '@mui/material';
import { getGalleryImages } from '@/services/api';  // Adjust the import path based on your project structure

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  location?: string;
}

const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryImages = await getGalleryImages();
        setImages(galleryImages.map(image => ({
          id: image._id,
          url: image.imageUrl,
          caption: image.title,
          location: image.description,
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to load images');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Container id="gallery" maxWidth="lg" sx={{ padding: '60px 0' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
        Photo Gallery
      </Typography>
      <Grid container spacing={2}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: '10px' }} />
            </Grid>
          ))
        ) : error ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="error" align="center">
              {error}
            </Typography>
          </Grid>
        ) : (
          images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '250px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
                onClick={() => handleOpen(image.url)}
              >
                <Box
                  component="img"
                  src={image.url}
                  alt={image.caption || 'Gallery Image'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                />
                {image.caption && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2">{image.caption}</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))
        )}
      </Grid>
      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: '90%', maxHeight: '90vh', borderRadius: '10px' }}>
          <img src={selectedImage} alt="Gallery Image" style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
        </Box>
      </Modal>
    </Container>
  );
};

export default GallerySection;
