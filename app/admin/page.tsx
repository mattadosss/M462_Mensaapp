import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Manage Daily Menus</h2>
                    <Link href="/admin/daily-menu">
                        <span className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Daily Menus</span>
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Manage Meals</h2>
                    <Link href="/admin/meals">
                        <span className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Go to Meals</span>
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Live Orders Overview</h2>
                    <Link href="/admin/orders-overview">
                        <span className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">View Live Orders</span>
                    </Link>
                </div>
            </div>
        </div>
    );
} 