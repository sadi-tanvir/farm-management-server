import Product from "../../database/models/Product";
import { checkAdminService } from "../services/admin.services";
import { ObjectId } from "mongodb"

interface CommonType {
    id: string;
    name: string;
};

interface ProductType {
    name: string;
    description?: string;
    unit: string;
    imageUrl?: string;
    category: CommonType;
    brand: CommonType;
};

const productResolver = {
    Query: {
        ////------>>> get all products <<<--------////
        products: async (_: any, args: any, context: { email: string; role: string; }) => {
            // checking admin authentication
            checkAdminService(context.role);

            // getting from database
            const _products = await Product.find()
                .populate('category.id')
                .populate('brand.id');
            return _products;
        },

        ////------>>> Get a product by ID <<<--------////
        getProductById: async (_: any, { id }: { id: string }, context: { email: string; role: string; }) => {
            // checking admin authentication
            checkAdminService(context.role);

            // getting from database
            const _product = await Product.findOne({ _id: id })
                .populate('category.id')
                .populate('brand.id');

            return _product;
        }
    },

    Mutation: {
        ////------>>> create a product <<<--------////
        createProduct: async (_: any, { data }: { data: ProductType }, context: any) => {
            const { name, description, unit, imageUrl, category, brand } = data;

            // checking admin authentication
            checkAdminService(context.role);

            // creating the product
            const _product = new Product({
                name,
                description,
                unit,
                imageUrl,
                category: {
                    id: new ObjectId(category.id),
                    name: category.name
                },
                brand: {
                    id: new ObjectId(brand.id),
                    name: brand.name
                }
            });

            await _product.save();

            return {
                status: true,
                message: 'The Product has been created successfully!'
            };
        }
    }
};

export default productResolver;