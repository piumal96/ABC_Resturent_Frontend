import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface GalleryFormProps {
  image?: {
    id: string;
    url: string;
    caption: string;
    location: string;
  };
  onSubmit: (data: { url: string; caption: string; location: string }) => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ image, onSubmit }) => {
  const [url, setUrl] = useState(image ? image.url : '');
  const [caption, setCaption] = useState(image ? image.caption : '');
  const [location, setLocation] = useState(image ? image.location : '');

  const handleSubmit = () => {
    onSubmit({ url, caption, location });
  };

  return (
    <form>
      <TextField
        label="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Location</InputLabel>
        <Select
          value={location}
          onChange={(e) => setLocation(e.target.value as string)}
        >
          <MenuItem value="Location 1">Location 1</MenuItem>
          <MenuItem value="Location 2">Location 2</MenuItem>
          {/* Add more locations as needed */}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {image ? 'Update Image' : 'Upload Image'}
      </Button>
    </form>
  );
};

export default GalleryForm;
