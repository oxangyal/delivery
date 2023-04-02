const express = require('express');
const Restaurant = require('../models/resto');
const router = express.Router();
const ensureAdmin = require('../middlewares/ensureAdmin');
const { addRestaurant, addDish } = require('../controllers/restaurants');
const upload = require('../middlewares/upload');
const dummyAuth = require('../middlewares/dummyAuth'); // Import dummyAuth

// Endpoint for all restaurants
router.get('/', async (req, res) => {
	try {
		const restaurants = await Restaurant.find();
		res.status(200).json(restaurants);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with restaurants list receiving' });
	}
});

// Endpoint for total restaurants count
router.get('/count', async (req, res) => {
  try {
    const count = await Restaurant.countDocuments();
    res.status(200).json(count);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with restaurants count receiving' });
  }
});

// Endpoint for one restaurant by Slug
router.get('/restaurant/:slug', async (req, res) => {
	try {
		const restaurant = await Restaurant.findOne({ slug: req.params.slug });
		if (restaurant == null) {
			return res.redirect('/');
		}

		res.status(200).json(restaurant);
	} catch (error) {
		console.error(error);

		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});

// Endpoint for one restaurant by ID
router.get('/:restaurantId', async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		console.log(restaurantId); // Resto ID in console

		const restaurant = await Restaurant.findById(restaurantId);
		if (restaurant == null) {
			return res.redirect('/');
		}

		res.status(200).json(restaurant);
	} catch (error) {
		console.error(error);
		
		res.status(500).json({ message: 'Error with restaurant receiving' });
	}
});

// Endpoint to delete a restaurant by ID
router.delete('/:restaurantId', async (req, res) => {
	try {
		const restaurantId = req.params.restaurantId;
		console.log('Deleting restaurant with ID:', restaurantId);

		const restaurant = await Restaurant.findById(restaurantId);
		if (restaurant == null) {
			return res.status(404).json({ message: 'Restaurant not found' });
		}

		await Restaurant.deleteOne({ _id: restaurantId });
		res.status(200).json({ message: 'Restaurant deleted successfully' });
	} catch (error) {
		console.error('Error deleting restaurant:', error);
		res.status(500).json({ message: 'Error deleting restaurant' });
	}
});


// Endpoint for all Dishes in restaurant
router.get('/:restaurantId/dishes', async (req, res) => {
	const restaurantId = req.params.restaurantId;
	console.log(restaurantId); // Resto ID in console
	try {
		const restaurant = await Restaurant.findById(restaurantId.toString());
		if (restaurant) {
			res.status(200).json(restaurant.dishes);
		} else {
			res.status(404).json({ message: 'Restaurant not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with dish receiving' });
	}
});

// Endpoint to get a specific Dish from a restaurant
router.get('/:restaurantId/dishes/:dishId', async (req, res) => {
	const restaurantId = req.params.restaurantId;
	const dishId = req.params.dishId;

	try {
		const restaurant = await Restaurant.findById(restaurantId.toString());
		if (restaurant) {
			const dish = restaurant.dishes.id(dishId);
			if (dish) {
				res.status(200).json(dish);
			} else {
				res.status(404).json({ message: 'Dish not found' });
			}
		} else {
			res.status(404).json({ message: 'Restaurant not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error with dish receiving' });
	}
});

// Admin

// Add a new restaurant
router.post('/', dummyAuth, addRestaurant);

// Add a new dish to a restaurant
router.post('/:restaurantId/dishes', dummyAuth, addDish);

module.exports = router;
