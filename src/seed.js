require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

const seedProducts = [
  {
    name: "Premium Ethiopian Leather Shoes",
    price: 3400,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    description: "100% genuine handcrafted local leather with exceptional durable sole structures.",
    stock: 12,
  },
  {
    name: "Traditional Handcrafted Coffee Set",
    price: 1850,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    description: "Classic ceramic jebena and coordinate cups setup for genuine cultural brewing.",
    stock: 8,
  },
  {
    name: "Premium Woven Cotton Scarf (Netela)",
    price: 1200,
    category: "Traditional Textiles",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
    description: "Elegant, lightweight pure cotton hand-woven by local masters with golden tilet boundaries.",
    stock: 15,
  },
  {
    name: "Organic Harar Coffee Beans (1KG)",
    price: 950,
    category: "Food & Beverage",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80",
    description: "Sun-dried single-origin medium roast Arabica beans with distinctive fruity notes.",
    stock: 25,
  },
  {
    name: "Handwoven Ethiopian Cotton Blanket",
    price: 2500,
    category: "Traditional Textiles",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600&auto=format&fit=crop&q=80",
    description: "Thick, soft, and breathable traditional cotton blanket with authentic cultural patterns.",
    stock: 10,
  },
  {
    name: "Spiced Ethiopian Tea Collection",
    price: 650,
    category: "Food & Beverage",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80",
    description: "Aromatic blend of black tea with cinnamon, clove, and traditional herbs.",
    stock: 30,
  },
  {
    name: "Ethiopian Leather Messenger Bag",
    price: 4200,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    description: "Durable full-grain leather bag with hand-stitched detailing and adjustable shoulder strap.",
    stock: 7,
  },
  {
    name: "Traditional Ethiopian Wood Stool",
    price: 3200,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&auto=format&fit=crop&q=80",
    description: "Carved from a single piece of local hardwood with authentic geometric tribal motifs.",
    stock: 5,
  },
  {
    name: "Handcrafted Silver Earrings",
    price: 1800,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c8ab60908?w=600&auto=format&fit=crop&q=80",
    description: "Intricately designed sterling silver earrings inspired by traditional Ethiopian crosses.",
    stock: 20,
  },
  {
    name: "Organic Sidamo Coffee Beans (1KG)",
    price: 1100,
    category: "Food & Beverage",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    description: "Washed single-origin medium roast with bright acidity and floral, citrus undertones.",
    stock: 22,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log(`Seeded ${seedProducts.length} products`);

    const adminExists = await User.findOne({ email: "admin@merkato.com" });
    if (!adminExists) {
      await User.create({
        firstName: "Store",
        lastName: "Manager",
        email: "admin@merkato.com",
        password: "admin123",
        role: "admin",
        isVerified: true,
      });
      console.log("Default admin user created");
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedDB();
