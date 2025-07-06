import React from 'react'
import type { Ride } from '../../types';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

interface RideItemsProps {
    ride: Ride;
}
const RideItem: React.FC<RideItemsProps> = ({ ride }) => {

    const navigate = useNavigate()

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

    const handleViewRide = (rideId: string) => {
        navigate(`/ride/${rideId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // const formatTime = (dateString: string) => {
    //     const date = new Date(dateString);
    //     return date.toLocaleTimeString('en-US', {
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });
    // };

    const statusConfig = getStatusConfig(ride.status);
    return (
        <div key={ride._id} className="p-4 hover:bg-gray-50 transition-colors">
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
                                <span>Due on {formatDate(ride.createdAt)}</span>
                                {ride.driver?.name && (
                                    <span>Driver: {ride.driver.name}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">

                        <div className="text-sm text-gray-500">
                            Rs. {ride.proposedFare}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 ">
                    <Button
                        label="View details"
                        intent="secondary"
                        onClick={() => handleViewRide(ride._id)}
                        className="px-3 py-1.5 text-sm  rounded-md "
                    />
                </div>
            </div>
        </div>
    );


}

export default RideItem