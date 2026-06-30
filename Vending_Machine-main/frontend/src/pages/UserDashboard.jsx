import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Plus, 
  Minus,
  Trash2,
  LogOut,
  Search,
  Filter,
  ShoppingBag,
  CreditCard,
  Package,
  History
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrderHistory from '../components/OrderHistory'

const UserDashboard = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const categories = ['All', 'Beverages', 'Snacks', 'Candy', 'Healthy', 'Other']

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      navigate('/login')
      return
    }
    fetchProducts()
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://vending-machine-r93c.onrender.com/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data.filter(p => p.isAvailable))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    navigate('/login')
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id)
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        alert(`Only ${product.quantity} units available for ${product.name}`)
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item._id === productId) {
        const newQuantity = item.quantity + change
        
        // Find the product to check available quantity
        const product = products.find(p => p._id === productId)
        
        // Check if trying to increase beyond available stock
        if (change > 0 && product && newQuantity > product.quantity) {
          alert(`Only ${product.quantity} units available for ${product.name}`)
          return item
        }
        
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    navigate('/cart')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">SmartVend</h1>
                <p className="text-sm text-slate-600">IoT Vending Machine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Order History Button */}
              <button
                onClick={() => setShowOrderHistory(true)}
                className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-xl transition-all shadow-md hover:shadow-lg"
                title="Order History"
              >
                <History className="w-6 h-6" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-md"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-md text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all shadow-md ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => {
            const cartItem = cart.find(item => item._id === product._id)
            const inCart = !!cartItem

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-slate-100 hover:border-blue-200"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
                      <p className="text-xs text-slate-500">{product.quantity} in stock</p>
                    </div>
                  </div>

                  {inCart ? (
                    <div className="flex items-center justify-between bg-blue-50 rounded-xl p-2">
                      <button
                        onClick={() => updateQuantity(product._id, -1)}
                        className="w-10 h-10 bg-white hover:bg-red-100 text-red-600 rounded-lg transition-colors shadow-md flex items-center justify-center"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg font-bold text-slate-900">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, 1)}
                        disabled={cartItem.quantity >= product.quantity}
                        className="w-10 h-10 bg-white hover:bg-green-100 text-green-600 rounded-lg transition-colors shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-xl">No products found</p>
          </div>
        )}
      </div>

      {/* Floating Cart Summary */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-200 shadow-2xl z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Items: {getTotalItems()}</p>
                <p className="text-2xl font-bold text-slate-900">₹{getTotalPrice()}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-6 h-6 text-slate-600" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item._id} className="bg-slate-50 rounded-xl p-4">
                          <div className="flex gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{item.name}</h3>
                              <p className="text-blue-600 font-bold">₹{item.price}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="w-7 h-7 bg-white hover:bg-red-100 text-red-600 rounded-md transition-colors flex items-center justify-center"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item._id, 1)}
                                  className="w-7 h-7 bg-white hover:bg-green-100 text-green-600 rounded-md transition-colors flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="ml-auto p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-slate-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold">₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-lg font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">₹{getTotalPrice()}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Order History Modal */}
      <OrderHistory isOpen={showOrderHistory} onClose={() => setShowOrderHistory(false)} />
    </div>
  )
}

export default UserDashboard
