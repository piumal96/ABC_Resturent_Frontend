import React, { useEffect, useState } from 'react';
import { fetchDishes, deleteDish, createDish, updateDish } from '@/services/api'; // Import your API functions
import { DishModel } from '@/models/Dish Model'; // No need for CustomizationModel anymore
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import Layout from '@/components/Layout/Layout';

const DishList: React.FC = () => {
  const categories = ['Starter', 'Main Course', 'Dessert', 'Drinks'] as const; // List of allowed categories

  const [dishes, setDishes] = useState<DishModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Partial<DishModel> | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    category: '' as DishModel['category'], // Ensure correct type for category
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      try {
        const fetchedDishes = await fetchDishes();
        setDishes(fetchedDishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDishes();
  }, []);

  const handleDelete = async (dishId: string) => {
    try {
      await deleteDish(dishId);
      setDishes(dishes.filter((dish) => dish._id !== dishId)); // Remove dish from UI
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const handleOpenModal = (dish?: DishModel) => {
    setEditMode(!!dish);
    if (dish) {
      setFormValues({
        name: dish.name,
        description: dish.description,
        price: String(dish.price),
        category: dish.category,
      });
      setSelectedDish(dish);
    } else {
      setFormValues({ name: '', description: '', price: '', category: 'Starter' });
      setSelectedDish(null);
    }
    setImageFile(undefined); // Reset the image file state to undefined
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDish(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<DishModel['category']>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category: e.target.value as DishModel['category'], // Ensure type safety
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Store the selected image file
    } else {
      setImageFile(undefined); // If no file is selected, set it to undefined
    }
  };

  const handleSaveDish = async () => {
    const dishData: Partial<DishModel> = {
      name: formValues.name,
      description: formValues.description,
      price: parseFloat(formValues.price),
      category: formValues.category,
    };

    try {
      if (editMode && selectedDish?._id) {
        await updateDish(selectedDish._id, dishData, imageFile); // Update existing dish
      } else {
        await createDish(dishData, imageFile); // Create new dish
      }

      const updatedDishes = await fetchDishes();
      setDishes(updatedDishes);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving dish:', error);
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: '20px' }}>
        {/* Button to Add a New Dish */}
        <Box sx={{ textAlign: 'right', marginBottom: '20px' }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Add New Dish
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {dishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} key={dish._id}>
                <Card sx={{ borderRadius: '10px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                  <CardContent>
                    {/* Display the image */}
                    {dish.imageUrl && (
                      <Box
                        component="img"
                        sx={{
                          height: 100, // Adjust the height as per your design
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px 10px 0 0',
                        }}
                        alt={dish.name}
                        
                        src={dish.imageUrl} // Display the image
                      />
                    )}
                    
                    <Typography variant="h6">{dish.name}</Typography>
                    <Typography variant="body2">{dish.description}</Typography>
                    <Typography variant="body1" color="primary">
                      LKR {dish.price.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Category: {dish.category}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button variant="outlined" color="primary" onClick={() => handleOpenModal(dish)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(dish._id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Dish Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{editMode ? 'Edit Dish' : 'Add New Dish'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Dish Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price (LKR)"
              name="price"
              value={formValues.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
              }}
            />
            <Select
              label="Category"
              value={formValues.category}
              onChange={handleCategoryChange}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveDish} color="primary">
              {editMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default DishList;
