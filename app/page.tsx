"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import ModelViewer from "./ModelViewer";
import { supabase } from "./supabase";

const menuItems = [
  { id: 1, name: "Double Patty Beef Burger", description: "Two juicy beef patties, fresh tomato, onion, and our special sauce", price: 850, category: "Burgers", image: "🍔", model: "/burger.glb" },
  { id: 2, name: "KFC Style Burger", description: "Crispy fried chicken, lettuce, mayo, and pickles", price: 650, category: "Burgers", image: "🍗", model: "/kfc_burger.glb" },
  { id: 3, name: "Stylized Smash Burger", description: "Smashed beef patty with special sauce and pickles", price: 750, category: "Burgers", image: "🍔", model: "/stylized_burger.glb" },
  { id: 4, name: "Pepperoni Pizza", description: "Classic tomato base, mozzarella, and pepperoni slices", price: 1200, category: "Pizza", image: "🍕", model: null },
  { id: 5, name: "Chicken Karahi", description: "Tender chicken cooked in spicy tomato masala", price: 1800, category: "Main Course", image: "🍛", model: null },
  { id: 6, name: "Chocolate Shake", description: "Thick creamy chocolate milkshake with whipped cream", price: 350, category: "Drinks", image: "🥤", model: null },
  { id: 7, name: "Loaded Fries", description: "Crispy fries topped with cheese sauce and jalapenos", price: 450, category: "Sides", image: "🍟", model: null },
];

const categories = ["All", ...new Set(menuItems.map(item => item.category))];

type CartItem = { id: number; name: string; price: number; quantity: number };

export default function Home() {
  const [active, setActive] = useState("All");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = active === "All" ? menuItems : menuItems.filter(i => i.category === active);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (!tableNumber) { alert("Please enter your table number!"); return; }
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    setLoading(true);
    const { error } = await supabase.from("orders").insert([{
      table_number: tableNumber,
      items: JSON.stringify(cart),
      total: `Rs. ${total}`,
      status: "pending"
    }]);
    setLoading(false);
    if (error) { alert("Error placing order. Try again!"); return; }
    setOrderPlaced(true);
    setCart([]);
    setShowCart(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {selectedModel && (
        <ModelViewer modelUrl={selectedModel} onClose={() => setSelectedModel(null)} />
      )}

      {/* Cart Popup */}
      {showCart && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px"
        }}>
          <div style={{
            backgroundColor: "#111827", borderRadius: "16px", padding: "20px",
            width: "100%", maxWidth: "400px", border: "1px solid #374151"
          }}>
            <h2 style={{ color: "#FB923C", fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
              Your Cart
            </h2>
            {cart.length === 0 ? (
              <p style={{ color: "#9CA3AF" }}>Cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: "1px solid #374151"
                  }}>
                    <div>
                      <p style={{ color: "white", fontSize: "14px" }}>{item.name}</p>
                      <p style={{ color: "#9CA3AF", fontSize: "12px" }}>x{item.quantity} — Rs. {item.price * item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: "none", border: "none", color: "#EF4444",
                      cursor: "pointer", fontSize: "18px"
                    }}>✕</button>
                  </div>
                ))}
                <p style={{ color: "#FB923C", fontWeight: "bold", marginTop: "12px", fontSize: "16px" }}>
                  Total: Rs. {total}
                </p>
                <input
                  type="text"
                  placeholder="Enter your table number"
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "8px",
                    backgroundColor: "#1F2937", border: "1px solid #374151",
                    color: "white", marginTop: "12px", fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
                <button onClick={placeOrder} disabled={loading} style={{
                  width: "100%", backgroundColor: "#FB923C", color: "#000",
                  fontWeight: "bold", padding: "14px", borderRadius: "12px",
                  border: "none", cursor: "pointer", fontSize: "16px", marginTop: "12px"
                }}>
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </>
            )}
            <button onClick={() => setShowCart(false)} style={{
              width: "100%", backgroundColor: "#374151", color: "white",
              padding: "12px", borderRadius: "12px", border: "none",
              cursor: "pointer", fontSize: "14px", marginTop: "8px"
            }}>Close</button>
          </div>
        </div>
      )}

      {/* Order Success Popup */}
      {orderPlaced && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px"
        }}>
          <div style={{
            backgroundColor: "#111827", borderRadius: "16px", padding: "32px",
            width: "100%", maxWidth: "360px", border: "1px solid #374151",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ color: "#FB923C", fontSize: "22px", fontWeight: "bold" }}>Order Placed!</h2>
            <p style={{ color: "#9CA3AF", marginTop: "8px" }}>Your order has been sent to the kitchen. We will bring it to your table soon!</p>
            <button onClick={() => setOrderPlaced(false)} style={{
              width: "100%", backgroundColor: "#FB923C", color: "#000",
              fontWeight: "bold", padding: "14px", borderRadius: "12px",
              border: "none", cursor: "pointer", fontSize: "16px", marginTop: "20px"
            }}>Done</button>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 border-b border-gray-800 px-6 py-6"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1 className="text-3xl font-bold text-orange-400">Brim Restaurant</h1>
          <p className="text-gray-400 mt-1 text-sm">Scan • Browse • Enjoy</p>
        </div>
        <button onClick={() => setShowCart(true)} style={{
          backgroundColor: "#FB923C", color: "#000", fontWeight: "bold",
          padding: "10px 16px", borderRadius: "12px", border: "none",
          cursor: "pointer", fontSize: "14px", position: "relative"
        }}>
          🛒 Cart {cartCount > 0 && `(${cartCount})`}
        </button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex gap-2 px-4 py-4 overflow-x-auto"
      >
        {categories.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              active === cat ? "bg-orange-400 text-gray-950" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}>
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Menu Items */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <motion.div layout className="flex flex-col gap-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id} layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(251,146,60,0.15)" }}
              className="bg-gray-900 rounded-2xl p-4 flex items-center gap-4 border border-gray-800"
            >
              <div className="text-5xl">{item.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base">{item.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-orange-400 font-bold text-sm whitespace-nowrap">Rs. {item.price}</div>
                <button onClick={() => addToCart(item)} style={{
                  backgroundColor: "#FB923C", color: "#000", fontWeight: "bold",
                  padding: "6px 12px", borderRadius: "20px", border: "none",
                  cursor: "pointer", fontSize: "12px"
                }}>+ Add</button>
                {item.model && (
                  <button onClick={() => setSelectedModel(item.model)} style={{
                    backgroundColor: "#1F2937", color: "#FB923C", fontWeight: "bold",
                    padding: "6px 12px", borderRadius: "20px", border: "1px solid #FB923C",
                    cursor: "pointer", fontSize: "12px"
                  }}>View 3D</button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center text-gray-600 text-xs pb-8 mt-8">
        Powered by Brim Restaurant
      </div>
    </main>
  );
}