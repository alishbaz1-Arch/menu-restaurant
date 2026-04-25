export default function Home() {
  const menuItems = [
    {
      id: 1,
      name: "Double Patty Beef Burger",
      description: "Two juicy beef patties, fresh tomato, onion, and our special sauce",
      price: "Rs. 850",
      category: "Burgers",
      image: "🍔"
    },
    {
      id: 2,
      name: "Crispy Chicken Burger",
      description: "Crispy fried chicken, lettuce, mayo, and pickles",
      price: "Rs. 650",
      category: "Burgers",
      image: "🍗"
    },
    {
      id: 3,
      name: "Pepperoni Pizza",
      description: "Classic tomato base, mozzarella, and pepperoni slices",
      price: "Rs. 1200",
      category: "Pizza",
      image: "🍕"
    },
    {
      id: 4,
      name: "Chicken Karahi",
      description: "Tender chicken cooked in spicy tomato masala",
      price: "Rs. 1800",
      category: "Main Course",
      image: "🍛"
    },
    {
      id: 5,
      name: "Chocolate Shake",
      description: "Thick creamy chocolate milkshake with whipped cream",
      price: "Rs. 350",
      category: "Drinks",
      image: "🥤"
    },
    {
      id: 6,
      name: "Loaded Fries",
      description: "Crispy fries topped with cheese sauce and jalapenos",
      price: "Rs. 450",
      category: "Sides",
      image: "🍟"
    },
  ];

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-6 text-center">
        <h1 className="text-3xl font-bold text-orange-400">Brim Restaurant</h1>
        <p className="text-gray-400 mt-1 text-sm">Scan • Browse • Enjoy</p>
      </div>

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {categories.map(category => (
          <div key={category} className="mb-10">
            <h2 className="text-orange-400 font-semibold text-lg mb-4 border-b border-gray-800 pb-2">
              {category}
            </h2>
            <div className="flex flex-col gap-4">
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-2xl p-4 flex items-center gap-4 border border-gray-800"
                  >
                    <div className="text-5xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-base">{item.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                    </div>
                    <div className="text-orange-400 font-bold text-sm whitespace-nowrap">
                      {item.price}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 text-xs pb-8">
        Powered by Brim Restaurant
      </div>
    </main>
  );
}