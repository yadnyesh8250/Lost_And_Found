import sequelize from "./config/DB.js";
import { Location, Category } from "./models/index.js";

const locationsMap = [
  { name: "Main Academic Block A", zone: "A Wing", latitude: 21.2851644, longitude: 74.8419764 },
  { name: "Main Academic Block B", zone: "B Wing", latitude: 21.2852644, longitude: 74.8420764 },
  { name: "Main Academic Block C", zone: "C Wing", latitude: 21.2853644, longitude: 74.8421764 },
  { name: "Main Academic Block D", zone: "D Wing", latitude: 21.2854644, longitude: 74.8422764 },
  { name: "Administrative Offices", zone: "Entrance", latitude: 21.2856644, longitude: 74.8410764 },
  { name: "Central Library", zone: "Library Hub", latitude: 21.2850644, longitude: 74.8418764 },
  { name: "Boys Hostel", zone: "Student Hostels", latitude: 21.2861644, longitude: 74.8449764 },
  { name: "Girls Hostel", zone: "Student Hostels", latitude: 21.2841644, longitude: 74.8409764 },
  { name: "Sports Complex", zone: "Recreation", latitude: 21.2831644, longitude: 74.8399764 },
  { name: "Cafeteria", zone: "Dining", latitude: 21.2858644, longitude: 74.8439764 },
  { name: "North Parking Area", zone: "Parking", latitude: 21.2866644, longitude: 74.8459764 },
];

const categoriesMap = [
  { name: "Electronics", description: "Phones, laptops, chargers, etc." },
  { name: "Stationery", description: "Books, notebooks, pens, geometry boxes" },
  { name: "Keys & Cards", description: "Room keys, vehicle keys, ID cards, debit cards" },
  { name: "Clothing", description: "Jackets, sweaters, caps, bags" },
  { name: "Accessories", description: "Watches, glasses, jewelry, umbrellas" },
  { name: "Miscellaneous", description: "Anything that doesn't fit other categories" },
];

const seedDB = async () => {
  try {
    // 1. Seed Locations
    await Location.sync(); 
    await Location.destroy({ where: {} });
    await Location.bulkCreate(locationsMap);
    console.log("Locations explicitly seeded successfully!");

    // 2. Seed Categories
    await Category.sync();
    await Category.destroy({ where: {} });
    await Category.bulkCreate(categoriesMap);
    console.log("Categories explicitly seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
