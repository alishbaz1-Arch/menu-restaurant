"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import ModelViewer from "./ModelViewer";

const menuItems = [
  { id: 1, name: "Double Patty Beef Burger", description: "Two juicy beef patties, fresh tomato, onion, and our special sauce", price: "Rs. 850", category: "Burgers", image: "🍔", model: "/burger.glb" },
  { id: 2, name: "KFC Style Burger", description: "Crispy fried chicken, lettuce, mayo, and pickles", price: "Rs. 650", category: "Burgers", image: "🍗", model: "/kfc_burger.glb" },
  { id: 3, name: "Stylized Smash Burger", description: "Smashed beef patty with special sauce and pickles", price: "Rs. 750", category: "Burgers", image: "🍔", model: "/stylized_burger.glb" },
  { id: 4, name: "Pepperoni Pizza", description: "Classic tomato base, mozzarella, and pepperoni slices", price: "Rs. 1200", category: "Pizza", image: "🍕", model: null },
  { id: 5, name: "Chicken Karahi", description: "Tender chicken cooked in spicy tomato masala", price: "Rs. 1800", category: "Main Course", image: "🍛", model: null },
  { id: 6, name: "Chocolate Shake", description: "Thick creamy chocolate milkshake with whipped cream", price: "Rs. 350", category: "Drinks", image: "🥤", model: null },
  { id: 7, name: "Loaded Fries", description: "Crispy fries topped with cheese sauce and jalapenos", price: "Rs. 450", category: "Sides", image: "🍟", model: null },
];

const categories = ["All", ...new Set(menuItems.map(item => item.category))];

export default function Home() {
  const [active, setActive] = useState("All");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const filtered = active === "All" ? menuItems : menuItems.filter(i => i.category === active);

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {selectedModel && (
        <ModelViewer modelUrl={selectedModel} onClose={() => setSelectedModel(null)} />
      )}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 border-b border-gray-800 px-6 py-6 text-center"
      >
        <h1 className="text-3xl font-bold text-orange-400">Brim Restaurant</h1>
        <p className="text-gray-400 mt-1 text-sm">Scan • Browse • Enjoy</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex gap-2 px-4 py-4 overflow-x-auto"
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              active === cat
                ? "bg-orange-400 text-gray-950"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <motion.div layout className="flex flex-col gap-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(251,146,60,0.15)" }}
              className="bg-gray-900 rounded-2xl p-4 flex items-center gap-4 border border-gray-800 cursor-pointer"
            >
              <div className="text-5xl">{item.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-base">{item.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-orange-400 font-bold text-sm whitespace-nowrap">
                  {item.price}
                </div>
                {item.model && (
                  <button
                    onClick={() => setSelectedModel(item.model)}
                    className="bg-orange-400 text-gray-950 text-xs px-3 py-1 rounded-full font-medium hover:bg-orange-300 transition-all"
                  >
                    View 3D
                  </button>
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