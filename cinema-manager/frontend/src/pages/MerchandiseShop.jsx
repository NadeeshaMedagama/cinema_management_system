import React, { useState, useEffect } from 'react';
import merchandiseService from '../services/merchandiseService';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import './MerchandiseShop.css';

const MerchandiseShop = () => {
  const { isAuthenticated } = useAuth();
  const [merchandiseList, setMerchandiseList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    'ALL',
    'TOYS',
    'ACTION_FIGURES',
    'PLUSHIES',
    'POSTERS',
    'T-SHIRTS',
    'MUGS',
    'COLLECTIBLES'
  ];

  useEffect(() => {
    fetchMerchandise();
    if (isAuthenticated) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    filterMerchandise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery, merchandiseList]);

  const fetchMerchandise = async () => {
    try {
      const data = await merchandiseService.getAllMerchandise();
      console.log('Shop - Fetched merchandise:', data);
      setMerchandiseList(data);
    } catch (error) {
      console.error('Error fetching merchandise:', error);
    }
  };

  const filterMerchandise = () => {
    let filtered = [...merchandiseList];

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.characterName && item.characterName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.relatedMovie && item.relatedMovie.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredList(filtered);
  };

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error.response?.status === 401) {
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart!');
      return;
    }

    try {
      setLoading(true);
      await cartService.addToCart(item.id, 1);
      await loadCart();
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Error adding item to cart. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (merchandiseId, newQuantity) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      await cartService.updateCartItem(merchandiseId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Error updating cart. Please try again.');
      }
      await loadCart(); // Reload to revert changes
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (merchandiseId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      await cartService.removeFromCart(merchandiseId);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.total || 0;
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Please login to checkout!');
      return;
    }

    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setLoading(true);
      await cartService.checkout();
      alert('Checkout successful! Thank you for your purchase.');
      await loadCart(); // This will create a new cart
      setShowCart(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Error during checkout. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merchandise-shop">
      <div className="shop-header">
        <h1>Movie Merchandise Store</h1>
        <p>Shop exclusive toys and collectibles from your favorite movies!</p>
      </div>

      <div className="shop-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, character, or movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button className="cart-toggle" onClick={() => setShowCart(!showCart)}>
          🛒 Cart ({getCartItemCount()}) - Rs. {getCartTotal().toFixed(2)}
        </button>
      </div>

      {showCart && (
        <div className="cart-panel">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button onClick={() => setShowCart(false)}>✕</button>
          </div>
          {!isAuthenticated ? (
            <p className="empty-cart">Please login to view your cart</p>
          ) : loading ? (
            <p className="empty-cart">Loading...</p>
          ) : !cart || cart.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.merchandiseId} className="cart-item">
                    <img 
                      src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="item-price">Rs. {item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity - 1)}
                          disabled={loading}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity + 1)}
                          disabled={loading}
                        >+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <p>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.merchandiseId)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <h3>Total: Rs. {getCartTotal().toFixed(2)}</h3>
                </div>
                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="merchandise-grid">
        {filteredList.length === 0 ? (
          <p className="no-results">No merchandise found matching your criteria.</p>
        ) : (
          filteredList.map(item => (
            <div key={item.id} className="product-card">
              <div className="product-image">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
                  alt={item.name}
                  onLoad={() => console.log('Shop - Image loaded:', item.name, item.imageUrl)}
                  onError={(e) => {
                    console.error('Shop - Image failed:', item.name, item.imageUrl);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                  }}
                  style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                />
                {item.stock === 0 && <div className="sold-out-badge">SOLD OUT</div>}
                {item.stock > 0 && item.stock < 10 && (
                  <div className="low-stock-badge">Only {item.stock} left!</div>
                )}
              </div>
              <div className="product-info">
                <h3>{item.name}</h3>
                {item.characterName && (
                  <p className="character-tag">
                    <span className="tag-icon">⭐</span> {item.characterName}
                  </p>
                )}
                {item.relatedMovie && (
                  <p className="movie-tag">
                    <span className="tag-icon">🎬</span> {item.relatedMovie}
                  </p>
                )}
                <p className="product-category">{item.category.replace('_', ' ')}</p>
                <p className="product-description">{item.description}</p>
                <div className="product-footer">
                  <span className="product-price">Rs. {item.price.toFixed(2)}</span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                    disabled={item.stock === 0 || loading}
                  >
                    {item.stock === 0 ? 'Out of Stock' : loading ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MerchandiseShop;
