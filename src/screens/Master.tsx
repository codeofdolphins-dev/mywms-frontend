import { link } from 'fs';
import MasterCard from '../components/MasterCard';
import { Link } from 'react-router-dom';

const items: Record<string, string>[] = [
    {
        title: "Categories",
        description: "Manage and organize product categories efficiently.",
        icon: "category",
        color: "bg-blue-500",
        link: "categories",
    },
    {
        title: "Brands",
        description: "Handle brand information and associations.",
        icon: "brand",
        color: "bg-green-500",
        link: "brands",
    },
    {
        title: "Products",
        description: "Oversee product details, pricing, and inventory.",
        icon: "product",
        color: "bg-red-500",
        link: "products",
    },
    {
        title: "Warehouses",
        description: "Manage warehouse locations and stock levels.",
        icon: "warehouse",
        color: "bg-yellow-500",
        link: "warehouses",
    },
    {
        title: "HSN Codes",
        description: "Maintain HSN codes for taxation and compliance.",
        icon: "hsn",
        color: "bg-purple-500",
        link: "hsncodes",
    },
    {
        title: "Suppliers",
        description: "Track supplier information and purchase history.",
        icon: "supplier",
        color: "bg-pink-500",
        link: "suppliers",
    },
]

const Master = () => {
    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse mb-5">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                    <div key={index}>
                        <MasterCard
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            color={item.color}
                            link={item.link}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Master
