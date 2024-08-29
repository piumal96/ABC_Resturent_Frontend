import React, { useState } from 'react';
import { Container, Typography, Grid, Box, Modal } from '@mui/material';

const images = [
  'https://images.unsplash.com/photo-1559339341-e8b89489a4a5',
  'https://images.unsplash.com/photo-1529042410759-befb1204b835',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2',
];

const GallerySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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
        {images.map((src, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
              src={src}
              alt={`Gallery Image ${index + 1}`}
              onClick={() => handleOpen(src)}
            />
          </Grid>
        ))}
      </Grid>
      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none' }}>
          <img src={selectedImage} alt="Gallery Image" style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }} />
        </Box>
      </Modal>
    </Container>
  );
};

export default GallerySection;
