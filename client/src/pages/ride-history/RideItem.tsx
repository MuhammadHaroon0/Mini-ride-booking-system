import React from 'react'
import type { Ride } from '../../types';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

interface RideItemsProps {
    ride: Ride;
    fetchRides: () => void
}
const RideItem: React.FC<RideItemsProps> = ({ ride, fetchRides }) => {

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
        // Navigate to ride details page or show modal
        console.log(`Viewing ride: ${rideId}`);
        navigate(`/ride/${rideId}`);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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


}

export default RideItem