import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import RideItem from "./RideItem";
import type { Ride } from "../../types";
import apiRoutes from "../../utils/apiRoutes";



interface RideListProps {
    userId?: string;
    showHistory?: boolean;
    maxHeight?: string;
}

const RidesHistory: React.FC<RideListProps> = ({
    showHistory = false,
    maxHeight = "400px"
}) => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRides = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(apiRoutes.getRideHistory);

            setRides(response.data.doc);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch rides';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, [showHistory]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={fetchRides}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="w-full p-6 md:p-16 md:px-24 shadow bg-white md:rounded-lg border border-gray-200">
            <div className="flex justify-between p-4 border-b border-gray-200">
                <div className="flex gap-4">

                    <h3 className="text-lg font-semibold text-gray-900">
                        {showHistory ? 'Ride History' : 'Recent Rides'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {rides.length} {rides.length === 1 ? 'ride' : 'rides'}
                    </p>
                </div>
                <Button
                    label="Refresh"
                    onClick={fetchRides}
                    className="rounded-md text-sm font-medium"
                />
            </div>

            <div
                className="overflow-y-auto"
                style={{ maxHeight }}
            >
                {rides.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="text-4xl mb-4">🚗</div>
                        <p className="text-lg font-medium">No rides yet</p>
                        <p className="text-sm">Your rides will appear here once you book one</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {rides.map((ride) => <RideItem key={ride._id} ride={ride} />
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default RidesHistory;