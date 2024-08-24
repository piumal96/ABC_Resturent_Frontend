import React from 'react';
import { Button, Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  location: string;
}

const GalleryList: React.FC = () => {
  const images: GalleryImage[] = [
    { id: '1', url: '/images/sample1.jpg', caption: 'Sample Image 1', location: 'Location 1' },
    { id: '2', url: '/images/sample2.jpg', caption: 'Sample Image 2', location: 'Location 2' },
    // Add more sample images
  ];

  const handleEdit = (id: string) => {
    // Handle edit image action
    console.log(`Edit image with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    // Handle delete image action
    console.log(`Delete image with id: ${id}`);
  };

  return (
    <Grid container spacing={4}>
      {images.map((image) => (
        <Grid item xs={12} sm={6} md={4} key={image.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={image.url}
              alt={image.caption}
            />
            <CardContent>
              <Typography variant="h6">{image.caption}</Typography>
              <Typography variant="body2" color="textSecondary">
                {image.location}
              </Typography>
              <Button onClick={() => handleEdit(image.id)} variant="outlined" color="primary">
                Edit
              </Button>
              <Button onClick={() => handleDelete(image.id)} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GalleryList;
