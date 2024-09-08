import React, { useEffect, useState } from 'react';
import { fetchDishes, deleteDish, createDish, updateDish } from '@/services/api'; // Import your API functions
import { DishModel, CustomizationModel } from '@/models/Dish Model'; // Import the DishModel interface
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Layout from '@/components/Layout/Layout';

const DishList: React.FC = () => {
  const [dishes, setDishes] = useState<DishModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Partial<DishModel> | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [customizations, setCustomizations] = useState<CustomizationModel[]>([]);

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
        imageUrl: dish.imageUrl,
      });
      setCustomizations(dish.customizations || []);
      setSelectedDish(dish);
    } else {
      setFormValues({ name: '', description: '', price: '', category: '', imageUrl: '' });
      setCustomizations([]);
      setSelectedDish(null);
    }
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

  // Handle adding or removing customizations
  const handleCustomizationChange = (index: number, field: keyof CustomizationModel, value: any) => {
    const updatedCustomizations = [...customizations];
    updatedCustomizations[index] = { ...updatedCustomizations[index], [field]: value };
    setCustomizations(updatedCustomizations);
  };

  const addCustomization = () => {
    setCustomizations([...customizations, { name: '', options: [], price: 0 }]);
  };

  const removeCustomization = (index: number) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };

  const handleSaveDish = async () => {
    const dishData: Partial<DishModel> = {
      name: formValues.name,
      description: formValues.description,
      price: parseFloat(formValues.price),
      customizations,
      imageUrl: formValues.imageUrl,
    };

    try {
      if (editMode && selectedDish?._id) {
        await updateDish(selectedDish._id, dishData); // Update existing dish
      } else {
        await createDish(dishData); // Create new dish
      }

      // Reload the dishes after saving
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
            <TextField
              label="Category"
              name="category"
              value={formValues.category}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              name="imageUrl"
              value={formValues.imageUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            {/* Customizations */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Customizations
              </Typography>
              {customizations.map((customization, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Customization Name"
                    value={customization.name}
                    onChange={(e) => handleCustomizationChange(index, 'name', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Price"
                    value={customization.price}
                    onChange={(e) => handleCustomizationChange(index, 'price', parseFloat(e.target.value))}
                    type="number"
                    sx={{ width: '100px', marginLeft: '10px' }}
                  />
                  <IconButton onClick={() => removeCustomization(index)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddCircleOutlineIcon />} onClick={addCustomization}>
                Add Customization
              </Button>
            </Box>
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
