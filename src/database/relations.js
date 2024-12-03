import User from '../modals/user.modal.js';
import Product from '../modals/products.modal.js';
import Address from '../modals/address.modal.js';
import Order from '../modals/order.modal.js';
import Cart from '../modals/cart.modal.js';
import Category from '../modals/categories.modal.js';

export const relations = async () => {
    // User Associations

    // Category Associations

    // Product and Category Associations
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
    Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

    // User and Address Associations
    User.hasMany(Address, { foreignKey: 'owner_id', as: 'addresses' });
    Address.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

    // User and Cart Associations
    User.hasMany(Cart, { foreignKey: 'owner_id', as: 'carts' });
    Cart.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

    // Product and Cart Associations
    Product.hasMany(Cart, { foreignKey: 'product_id', as: 'cartItems' });
    Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // User and Order Associations
    User.hasMany(Order, { foreignKey: 'owner_id', as: 'orders' });
    Order.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

    // Product and Order Associations
    Product.hasMany(Order, { foreignKey: 'product_id', as: 'orders' });
    Order.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

    // Address and Order Associations
    Address.hasMany(Order, { foreignKey: 'address_id', as: 'orders' });
    Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });

}