const express = require('express');
var morgan = require('morgan');
// import routes
const authRoutes = require('./routes/auth.route');
const uploadRoutes = require('./routes/upload.route');
const vehicleRoutes = require('./routes/vehicle.route');
const vehicleLocationRoutes = require('./routes/vehicleLocation.routes');
const bookingRoutes = require('./routes/booking.route');
const paymentRoutes = require('./routes/payment.route');
const paymentController = require('./controllers/payment.controller');
const reviewRoutes = require('./routes/review.route');
const favoriteRoutes = require('./routes/favorite.route');
const adminRoutes = require('./routes/admin.route');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(morgan('dev'));

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

app.use(express.json());
app.use('/api/uploads', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicle_location', vehicleLocationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);


module.exports = app;
