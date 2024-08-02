(async () => {
    try {
        if (process.env.PERSISTANCE !== 'mongodb') {
            console.log("Error: data persistance should be <mongodb> in .env file\nAborting ...");
        }
        else {
            const { productDAO, cartDAO, userDAO, orderDAO, messageDAO } = await import('../models/daos/index.js');
            const { encryptPassword } = await import('../utils/bcrypt.js');
            let products = [
                {
                    timestamp: 1665419816542,
                    name: "Fideos",
                    description: "Mostachol MATARAZZO Paquete 500 Gr",
                    cathegory: {
                        id: 1,
                        name: "Alimentos no perecederos"
                    },
                    image: "https://cdn0.iconfinder.com/data/icons/pasta-flat/300/Noodles_8-256.png",
                    price: 175.9,
                    stock: 50
                },
                {
                    timestamp: 1665419816543,
                    name: "Leche",
                    description: "Leche Entera LA SERENISIMA 3% Sachet 1 L",
                    cathegory: {
                        id: 2,
                        name: "Productos lácteos"
                    },
                    code: "Productos lácteos",
                    image: "https://cdn0.iconfinder.com/data/icons/food-set-4/64/Artboard_7-256.png",
                    price: 207,
                    stock: 20
                },
                {
                    timestamp: 1665419816544,
                    name: "Mermelada",
                    description: "Mermelada Arándanos Bc La Campagnola Fra 390 Grm",
                    cathegory: {
                        id: 6,
                        name: "Azucar, dulces y chocolates"
                    },
                    image: "https://cdn2.iconfinder.com/data/icons/bakery-kitchen-3/512/jam-jar-berries-256.png",
                    price: 613.25,
                    stock: 60
                },
                {
                    timestamp: 1665419816545,
                    name: "Yerba",
                    description: "Yerba Mate Suave PLAYADITO 1 Kg",
                    cathegory: {
                        id: 5,
                        name: "Café, cacao e infusiones"
                    },
                    image: "https://cdn3.iconfinder.com/data/icons/argentina-3/504/tea-yerba-mate-drink-argentina-256.png",
                    price: 748.6,
                    stock: 50
                },
                {
                    timestamp: 1665419816546,
                    name: "Café",
                    description: "Café Instántaneo Suave Y Espumoso Arlistan Fra 170 Grm",
                    cathegory: {
                        id: 5,
                        name: "Café, cacao e infusiones"
                    },
                    image: "https://cdn2.iconfinder.com/data/icons/coffee-19/450/Coffee_bag-256.png",
                    price: 1017.25,
                    stock: 20
                },
                {
                    timestamp: 1665419816547,
                    name: "Carne",
                    description: "Milanesa Bola De Lomo Estancias Coto X KG",
                    cathegory: {
                        id: 3,
                        name: "Carnes y verivados"
                    },
                    image: "https://cdn3.iconfinder.com/data/icons/meat-14/50/14-256.png",
                    price: 999.9,
                    stock: 60
                },
                {
                    timestamp: 1665419816548,
                    name: "Banana",
                    description: "Banana Cavendish Xkg",
                    cathegory: {
                        id: 4,
                        name: "Frutas y verduras"
                    },
                    image: "https://cdn0.iconfinder.com/data/icons/fruity-3/512/Banana-512.png",
                    price: 389.00,
                    stock: 50
                },
                {
                    timestamp: 1665419816549,
                    name: "Coca-Cola",
                    description: "Gaseosa Coca-Cola Sabor Original 1,75 Lt",
                    cathegory: {
                        id: 8,
                        name: "Bebidas no alcohólicas"
                    },
                    image: "https://cdn3.iconfinder.com/data/icons/food-drink-52/100/coke-512.png",
                    price: 410.97,
                    stock: 120
                },
                {
                    timestamp: 1665419816550,
                    name: "Pan Lactal",
                    description: "Pan De Mesa Blanco Lactal Bsa 500 Grm",
                    cathegory: {
                        id: 0,
                        name: "Panes y cereales"
                    },
                    image: "https://cdn2.iconfinder.com/data/icons/bakery-color/200/08-512.png",
                    price: 418.99,
                    stock: 40
                },
                {
                    timestamp: 1665419816550,
                    name: "Whiskey",
                    description: "Whisky Johnnie Walker 750 Ml Red Label",
                    cathegory: {
                        id: 7,
                        name: "Bebidas alcohólicas"
                    },
                    image: "https://cdn0.iconfinder.com/data/icons/beverage-43/128/whiskey-alcohol-brandy-scotch-liquor-256.png",
                    price: 3571.77,
                    stock: 60
                }
            ];

            /********************************************************************************************/
            /***************************************** MONGO DB *****************************************/
            /********************************************************************************************/

            console.log("📂 Generating data in MongoDB 📂");

            // Delete previous elements
            await productDAO.collection.deleteMany({});
            await cartDAO.collection.deleteMany({});
            await userDAO.collection.deleteMany({});
            await orderDAO.collection.deleteMany({});
            await messageDAO.collection.deleteMany({});

            // Add new products
            for (let i = 0; i < products.length; i++) {
                await productDAO.create(products[i]);
            }

            // Add admin user and one random user
            await userDAO.create({
                name: "admin",
                email: "admin@gmail.com",
                password: encryptPassword('admin'),
                age: "39",
                address: "Esmeralda 1027. Buenos Aires, Argentina.",
                avatar: '/image/avatar/admin.png',
                admin: 1
            });

            await userDAO.create({
                name: "Marcos Alvarez",
                email: "marcosa@gmail.com",
                password: encryptPassword('marcosa'),
                admin: 0
            });

            console.log('📂✔ DB initialized in MongoDB ✔📂');
            console.log('All done. Press Ctrl + c to finish ...\n');
        }
    }
    catch (e) {
        console.log('📂❌ Error creating data for DB ❌📂\n' + e);
    }
})(true)