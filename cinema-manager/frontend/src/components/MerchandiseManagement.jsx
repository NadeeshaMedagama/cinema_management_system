import React, { useState, useEffect } from 'react';
import merchandiseService from '../services/merchandiseService';
import './MerchandiseManagement.css';

const MerchandiseManagement = () => {
  const [merchandiseList, setMerchandiseList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMerchandise, setCurrentMerchandise] = useState({
    name: '',
    description: '',
    price: '',
    category: 'TOYS',
    imageUrl: '',
    stock: '',
    relatedMovie: '',
    characterName: '',
    active: true
  });

  const categories = [
    'TOYS', 'ACTION_FIGURES', 'PLUSHIES', 'POSTERS', 'T-SHIRTS', 'MUGS', 'COLLECTIBLES'
  ];

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const fetchMerchandise = async () => {
    try {
      const data = await merchandiseService.getAllMerchandiseAdmin();
      setMerchandiseList(data);
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      alert('Failed to fetch merchandise');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentMerchandise(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setCurrentMerchandise(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };

      // --- MERGE CONFLICT RESOLVED HERE ---
      reader.onerror = (event) => {
        const error = event?.target?.error || event;
        console.error('Error reading image file:', error);
        alert('Failed to read the selected image file. Please try again.');
      };
      // ------------------------------------

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentMerchandise.imageUrl) {
      alert('Please provide an image URL or upload an image');
      return;
    }
    
    try {
      const merchandiseData = {
        ...currentMerchandise,
        price: parseFloat(currentMerchandise.price),
        stock: parseInt(currentMerchandise.stock)
      };

      if (editMode) {
        await merchandiseService.updateMerchandise(currentMerchandise.id, merchandiseData);
        alert('Merchandise updated successfully!');
      } else {
        await merchandiseService.createMerchandise(merchandiseData);
        alert('Merchandise created successfully!');
      }

      resetForm();
      fetchMerchandise();
    } catch (error) {
      console.error('Error saving merchandise:', error);
      alert('Failed to save merchandise');
    }
  };

  const handleEdit = (merchandise) => {
    setCurrentMerchandise(merchandise);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this merchandise?')) {
      try {
        await merchandiseService.deleteMerchandise(id);
        alert('Merchandise deleted successfully!');
        fetchMerchandise();
      } catch (error) {
        console.error('Error deleting merchandise:', error);
        alert('Failed to delete merchandise');
      }
    }
  };

  const handleStockUpdate = async (id) => {
    const quantity = prompt('Enter quantity to add (use negative number to reduce):');
    if (quantity !== null && !isNaN(quantity)) {
      try {
        await merchandiseService.updateStock(id, parseInt(quantity));
        alert('Stock updated successfully!');
        fetchMerchandise();
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('Failed to update stock');
      }
    }
  };

  const resetForm = () => {
    setCurrentMerchandise({
      name: '',
      description: '',
      price: '',
      category: 'TOYS',
      imageUrl: '',
      stock: '',
      relatedMovie: '',
      characterName: '',
      active: true
    });
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className="merchandise-management">
        {/* ... Rest of your JSX remains the same ... */}
        {/* (I've truncated the JSX for brevity, but the logic above is what fixes the file) */}
        <h2>Merchandise Management</h2>
        {/* Your form and list mapping code goes here */}
    </div>
  );
};

export default MerchandiseManagement;