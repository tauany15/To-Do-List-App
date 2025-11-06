const Item = require("../models/Item");
const List = require("../models/List");

// Fallback capitalize function in case utils/helpers.js doesn't exist
const capitalize = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Default items for new lists
const defaultItems = [
  { name: "Welcome to your To-Do List!", completed: false },
  { name: "Click + to add a new item", completed: false },
  { name: "Click checkbox to mark items complete", completed: false }
];

// Get default list (Today)
exports.getDefaultList = async (req, res, next) => {
  try {
    let items = await Item.find({}).sort({ createdAt: -1 });
    
    if (items.length === 0) {
      await Item.insertMany(defaultItems);
      items = await Item.find({}).sort({ createdAt: -1 });
    }
    
    res.render("list", { 
      listTitle: "Today", 
      listRoute: "/",
      items,
      stats: getStats(items)
    });
  } catch (err) {
    next(err);
  }
};

// Get custom list
exports.getCustomList = async (req, res, next) => {
  try {
    const customListName = capitalize(req.params.customListName);
    
    // Prevent reserved routes
    if (["add", "delete", "update", "toggle", "about"].includes(customListName.toLowerCase())) {
      return res.redirect("/");
    }
    
    let list = await List.findOne({ name: customListName });
    
    if (!list) {
      list = await List.create({
        name: customListName,
        items: defaultItems
      });
    }
    
    res.render("list", { 
      listTitle: list.name, 
      listRoute: `/${customListName}`,
      items: list.items,
      stats: getStats(list.items)
    });
  } catch (err) {
    next(err);
  }
};

// Add new item
exports.addItem = async (req, res, next) => {
  try {
    const { itemName, listName } = req.body;
    
    if (!itemName || !itemName.trim()) {
      return res.redirect(listName === "Today" ? "/" : `/${listName}`);
    }
    
    const newItem = {
      name: itemName.trim(),
      completed: false
    };
    
    if (listName === "Today") {
      await Item.create(newItem);
      res.redirect("/");
    } else {
      await List.findOneAndUpdate(
        { name: listName },
        { $push: { items: newItem } }
      );
      res.redirect(`/${listName}`);
    }
  } catch (err) {
    next(err);
  }
};

// Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    const { itemId, listName } = req.body;
    
    if (listName === "Today") {
      await Item.findByIdAndDelete(itemId);
      res.redirect("/");
    } else {
      await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: itemId } } }
      );
      res.redirect(`/${listName}`);
    }
  } catch (err) {
    next(err);
  }
};

// Toggle item completion status
exports.toggleItem = async (req, res, next) => {
  try {
    const { itemId, listName } = req.body;
    
    if (listName === "Today") {
      // Get current item to toggle its status
      const item = await Item.findById(itemId);
      if (item) {
        await Item.findByIdAndUpdate(itemId, { completed: !item.completed });
      }
      res.redirect("/");
    } else {
      // Find the list and the specific item
      const list = await List.findOne({ name: listName });
      if (list) {
        const item = list.items.id(itemId);
        if (item) {
          item.completed = !item.completed;
          await list.save();
        }
      }
      res.redirect(`/${listName}`);
    }
  } catch (err) {
    next(err);
  }
};

// Update item text
exports.updateItem = async (req, res, next) => {
  try {
    const { itemId, itemName, listName } = req.body;
    
    if (!itemName || !itemName.trim()) {
      return res.redirect(listName === "Today" ? "/" : `/${listName}`);
    }
    
    if (listName === "Today") {
      await Item.findByIdAndUpdate(itemId, { name: itemName.trim() });
      res.redirect("/");
    } else {
      await List.findOneAndUpdate(
        { name: listName, "items._id": itemId },
        { $set: { "items.$.name": itemName.trim() } }
      );
      res.redirect(`/${listName}`);
    }
  } catch (err) {
    next(err);
  }
};

// About page
exports.getAboutPage = (req, res) => {
  res.render("about");
};

// Helper function to calculate stats
function getStats(items) {
  const total = items.length;
  const completed = items.filter(item => item.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, pending, percentage };
}