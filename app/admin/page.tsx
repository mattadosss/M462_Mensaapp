import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Tagesmenüs verwalten</h2>
                    <p className="text-gray-600 text-center mb-4">
                        Erstellen und bearbeiten Sie die täglichen Menüs
                    </p>
                    <Link href="/admin/daily-menu">
                        <button className="mt-4 py-2 px-6 rounded-xl bg-primary text-white font-semibold text-base hover:bg-[#5a8e22] transition block mx-auto min-w-[180px] max-w-full">
                            Zu den Tagesmenüs
                        </button>
                    </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Gerichte verwalten</h2>
                    <p className="text-gray-600 text-center mb-4">
                        Hinzufügen, bearbeiten und löschen Sie Gerichte
                    </p>
                    <Link href="/admin/meals">
                        <button className="mt-4 py-2 px-6 rounded-xl bg-primary text-white font-semibold text-base hover:bg-[#5a8e22] transition block mx-auto min-w-[180px] max-w-full">
                            Zu den Gerichten
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Rabattgruppen verwalten</h2>
                    <p className="text-gray-600 text-center mb-4">
                        Definieren Sie Rabattgruppen und deren Konditionen
                    </p>
                    <Link href="/admin/discount-groups">
                        <button className="mt-4 py-2 px-6 rounded-xl bg-primary text-white font-semibold text-base hover:bg-[#5a8e22] transition block mx-auto min-w-[180px] max-w-full">
                            Zu den Rabattgruppen
                        </button>
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-4">Live Orders Overview</h2>
                    <Link href="/admin/orders-overview">
                        <button className="mt-4 py-2 px-6 rounded-xl bg-primary text-white font-semibold text-base hover:bg-[#5a8e22] transition block mx-auto min-w-[180px] max-w-full">
                            View Live Orders
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 