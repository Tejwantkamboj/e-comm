import { sequelizeConnection } from './connection.js';
import { relations } from './relations.js';


export const connectAndSyncModels = async () => {
    try {
        await sequelizeConnection.authenticate();
        const { default: Cart } = await import('../modals/cart.modal.js');
        const { default: Order } = await import('../modals/order.modal.js');
        const { default: User } = await import('../modals/user.modal.js');
        const { default: Category } = await import('../modals/categories.modal.js')
        const { default: Product } = await import('../modals/products.modal.js');
        const { default: Address } = await import('../modals/address.modal.js');

        await relations();
        // Sync models
        await sequelizeConnection.sync({ alter: true, force: false });

        // await Promise.all([
        //     await User.sync({ force: false }),
        //     await Category.sync({ force: false }),
        //     await Product.sync({ force: false }),
        //     await Address.sync({ force: false }),
        //     await Cart.sync({ force: false }),
        //     await Order.sync({ force: false }),
        // ]);

        console.log('Connection to the database has been established successfully.');
        console.log('Models synchronized successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

connectAndSyncModels();

