// CartManager.js
class CartManager {
    constructor() {
        this.listeners = [];
    }

    // Isay BottomNav mein call karein subscribe karne ke liye
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    // Jab bhi Cart mein kuch add/remove ho, isay call karein
    notify() {
        this.listeners.forEach(callback => callback());
    }
}

export const cartManager = new CartManager();