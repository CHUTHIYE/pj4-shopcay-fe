import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { createProduct } from "../../api/product";
import axios from "axios";

const Create = ({ open, onClose, onProductCreated }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    qty: "",
    status: true,
    canRent: false,
    rentPrice: "",
    images: [],
  });

  const [images, setImages] = useState([]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = await Promise.all(files.map(uploadImage));

    setImages((prevImages) => [...prevImages, ...uploadedImages]);
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));
  };

  const uploadImage = async (file) => {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dx2o9ki2g/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_uploads");

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setNewProduct((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      onProductCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create product", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          size="small"
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          size="small"
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          size="small"
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            size="small"
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          >
            <MenuItem value="Fruit Tree">Fruit Tree</MenuItem>
            <MenuItem value="Flowering Tree">Flowering Tree</MenuItem>
            <MenuItem value="Shade Tree">Shade Tree</MenuItem>
            <MenuItem value="Ornamental Tree">Ornamental Tree</MenuItem>
            <MenuItem value="Evergreen Tree">Evergreen Tree</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          name="qty"
          value={newProduct.qty}
          onChange={handleChange}
          size="small"
        />
        <FormControlLabel
          control={<Switch checked={newProduct.canRent} onChange={handleChange} name="canRent" />}
          label="Can Rent"
        />
        {newProduct.canRent && (
          <TextField
            margin="dense"
            label="Rental Price"
            type="number"
            fullWidth
            name="rentPrice"
            value={newProduct.rentPrice}
            onChange={handleChange}
            size="small"
          />
        )}

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          type="file"
          multiple
          onChange={handleImageChange}
        />
        <br />
        <label htmlFor="image-upload">
          <Button variant="contained" component="span">
            Upload Images
          </Button>
        </label>
        <Box sx={{ marginTop: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {images.map((url, index) => (
            <Box key={index} sx={{ position: 'relative', display: 'inline-block' }}>
              <img src={url} alt="Uploaded" style={{ width: '100px', height: 'auto', borderRadius: '8px' }} />
              <IconButton
                onClick={() => handleRemoveImage(index)}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateProduct}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Create;
