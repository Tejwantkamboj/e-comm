export const getUserModal = async () => {
    let User
    try {
        const { default: importedUser } = await import("../modals/user.modal.js");
        User = importedUser; // Cache the imported User model
    } catch (error) {
        console.error("Error importing User model:", error);
        throw new Error("Failed to load User model.");
    }
    return User
}

export const productModal = async () => {
    let Product
    try {
        const { default: importedUser } = await import("../modals/products.modal.js");
        Product = importedUser; // Cache the imported User model
    } catch (error) {
        console.error("Error importing Product model:", error);
        throw new Error("Failed to load User model.");
    }
    return Product
}

export const addressModal = async () => {
    let User
    try {
        const { default: importedUser } = await import("../modals/user.modal.js");
        User = importedUser; // Cache the imported User model
    } catch (error) {
        console.error("Error importing User model:", error);
        throw new Error("Failed to load User model.");
    }
    return User
}


export const cartModal = async () => {
    let User
    try {
        const { default: importedUser } = await import("../modals/user.modal.js");
        User = importedUser; // Cache the imported User model
    } catch (error) {
        console.error("Error importing User model:", error);
        throw new Error("Failed to load User model.");
    }
    return User
}

export const orderModal = async () => {
    let User
    try {
        const { default: importedUser } = await import("../modals/user.modal.js");
        User = importedUser; // Cache the imported User model
    } catch (error) {
        console.error("Error importing User model:", error);
        throw new Error("Failed to load User model.");
    }
    return User
}

export const categoryModal = async () => {
    let User
    try {
        const { default: importedUser } = await import("../modals/user.modal.js");
        User = importedUser; // Cache the imported User model
    } catch (error) {
        console.error("Error importing User model:", error);
        throw new Error("Failed to load User model.");
    }
    return User
}