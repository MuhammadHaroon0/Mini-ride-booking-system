import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";

interface Ride {
    id: string;
    pickupLocation: string;
    dropOffLocation: string;
    rideType: 'bike' | 'car' | 'rickshaw';
    status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    fare: number;
    driverName?: string;
    requestedAt: string;
    completedAt?: string;
    estimatedTime?: string;
}

interface RideListProps {
    userId?: string;
    showHistory?: boolean;
    maxHeight?: string;
}

const RidesHistory: React.FC<RideListProps> = ({
    userId,
    showHistory = false,
    maxHeight = "400px"
}) => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getStatusConfig = (status: Ride['status']) => {
        switch (status) {
            case 'requested':
                return {
                    label: 'Requested',
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
                };
            case 'accepted':
                return {
                    label: 'Accepted',
                    color: 'bg-blue-100 text-blue-800 border-blue-200'
                };
            case 'in_progress':
                return {
                    label: 'In Progress',
                    color: 'bg-purple-100 text-purple-800 border-purple-200'
                };
            case 'completed':
                return {
                    label: 'Complete',
                    color: 'bg-green-100 text-green-800 border-green-200'
                };
            case 'cancelled':
                return {
                    label: 'Cancelled',
                    color: 'bg-red-100 text-red-800 border-red-200'
                };
            default:
                return {
                    label: 'Unknown',
                    color: 'bg-gray-100 text-gray-800 border-gray-200'
                };
        }
    };

    const getRideIcon = (rideType: Ride['rideType']) => {
        switch (rideType) {
            case 'bike':
                return '🏍️';
            case 'car':
                return '🚗';
            case 'rickshaw':
                return '🛺';
            default:
                return '🚗';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchRides = async () => {
        setLoading(true);
        setError(null);

        try {
            const endpoint = showHistory ? '/api/rides/history' : '/api/rides/current';
            const response = await axios.get(endpoint, {
                params: userId ? { userId } : undefined
            });

            setRides(response.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch rides';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleViewRide = (rideId: string) => {
        // Navigate to ride details page or show modal
        console.log(`Viewing ride: ${rideId}`);
        // navigate(`/ride/${rideId}`);
    };

    const handleCancelRide = async (rideId: string) => {
        try {
            await axios.put(`/api/rides/${rideId}/cancel`);
            toast.success('Ride cancelled successfully');
            fetchRides(); // Refresh the list
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to cancel ride';
            toast.error(errorMessage);
        }
    };

    // useEffect(() => {
    //     fetchRides();
    // }, [showHistory, userId]);

    useEffect(() => {
        const mockRides: Ride[] = [
            {
                id: '1',
                pickupLocation: 'Mall Road',
                dropOffLocation: 'Airport',
                rideType: 'car',
                status: 'completed',
                fare: 250,
                driverName: 'Ahmed Khan',
                requestedAt: '2024-01-15T10:30:00Z',
                completedAt: '2024-01-15T11:15:00Z',
                estimatedTime: '45 min'
            },
            {
                id: '2',
                pickupLocation: 'City Center',
                dropOffLocation: 'Model Town',
                rideType: 'bike',
                status: 'in_progress',
                fare: 80,
                driverName: 'Ali Hassan',
                requestedAt: '2024-01-16T14:20:00Z',
                estimatedTime: '20 min'
            },
            {
                id: '3',
                pickupLocation: 'University',
                dropOffLocation: 'Railway Station',
                rideType: 'rickshaw',
                status: 'requested',
                fare: 120,
                requestedAt: '2024-01-16T15:45:00Z',
                estimatedTime: '30 min'
            },
            {
                id: '4',
                pickupLocation: 'Hospital',
                dropOffLocation: 'Industrial Area',
                rideType: 'car',
                status: 'cancelled',
                fare: 180,
                requestedAt: '2024-01-14T09:15:00Z',
                estimatedTime: '35 min'
            },
            {
                id: '4',
                pickupLocation: 'Hospital',
                dropOffLocation: 'Industrial Area',
                rideType: 'car',
                status: 'accepted',
                fare: 180,
                requestedAt: '2024-01-14T09:15:00Z',
                estimatedTime: '35 min'
            }
        ];
        setRides(mockRides);
    }, []);

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
                        {rides.map((ride) => {
                            const statusConfig = getStatusConfig(ride.status);
                            const canCancel = ride.status === 'requested' || ride.status === 'accepted';

                            return (
                                <div key={ride.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
                                        {/* Left side - Ride info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-xl">{getRideIcon(ride.rideType)}</span>
                                                <div>
                                                    <div className="flex gap-4 items-center">

                                                        <h4 className="text-base font-medium text-gray-900 truncate">
                                                            {ride.pickupLocation} → {ride.dropOffLocation}
                                                        </h4>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                        <span>Due on {formatDate(ride.requestedAt)}</span>
                                                        {ride.driverName && (
                                                            <span>Driver: {ride.driverName}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">

                                                <div className="text-sm text-gray-500">
                                                    Rs. {ride.fare}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Actions */}
                                        <div className="flex items-center space-x-2 ">
                                            <Button
                                                label="View details"
                                                intent="secondary"
                                                onClick={() => handleViewRide(ride.id)}
                                                className="px-3 py-1.5 text-sm  rounded-md "
                                            />


                                            {canCancel && (
                                                <Button
                                                    label="Cancel"
                                                    intent="secondary"
                                                    onClick={() => handleCancelRide(ride.id)}
                                                    className="px-3 py-1.5 text-sm rounded-md "
                                                />

                                            )}


                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


        </div>
    );
};

export default RidesHistory;