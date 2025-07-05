import React from 'react';
import type { Ride } from '../../types';



const IndividualRide: React.FC = () => {
    const ride: Ride = {
        id: '4',
        pickupLocation: 'Hospital',
        dropOffLocation: 'Industrial Area',
        rideType: 'car',
        status: 'completed',
        driverName: "Ali",
        fare: 180,
        requestedAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T11:15:00Z',
        estimatedTime: '45 min'
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl my-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ride Details</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
                <div>
                    <span className="font-semibold">Pickup:</span> {ride.pickupLocation}
                </div>
                <div>
                    <span className="font-semibold">Drop-off:</span> {ride.dropOffLocation}
                </div>
                <div>
                    <span className="font-semibold">Type:</span> {ride.rideType}
                </div>
                <div>
                    <span className="font-semibold">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-white text-sm ${getStatusColor(ride.status)}`}>
                        {ride.status}
                    </span>
                </div>
                <div>
                    <span className="font-semibold">Fare:</span> Rs {ride.fare}
                </div>
                <div>
                    <span className="font-semibold">Driver:</span> {ride.driverName || 'Not assigned'}
                </div>
                <div>
                    <span className="font-semibold">Requested At:</span> {formatDate(ride.requestedAt)}
                </div>
                {ride.completedAt && (
                    <div>
                        <span className="font-semibold">Completed At:</span> {formatDate(ride.completedAt)}
                    </div>
                )}
                {ride.status === "completed" && (
                    <div>
                        <img src='/barcode.png' className='w-50' />
                    </div>
                )}

            </div>
        </div>
    );
};

const formatDate = (iso: string) => new Date(iso).toLocaleString();

const getStatusColor = (status: Ride['status']) => {
    switch (status) {
        case 'requested':
            return 'bg-blue-500';
        case 'accepted':
            return 'bg-green-500';
        case 'in_progress':
            return 'bg-yellow-500';
        case 'completed':
            return 'bg-gray-700';
        case 'cancelled':
            return 'bg-red-500';
        default:
            return 'bg-gray-400';
    }
};

export default IndividualRide;
