import React, { useEffect, useState } from 'react';
import type { Ride } from '../../types';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import apiRoutes from '../../utils/apiRoutes';



const IndividualRide: React.FC = () => {
    const { id } = useParams()
    if (!id)
        return null
    const [ride, setRide] = useState<Ride>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRide = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(apiRoutes.getRide(id));

            setRide(response.data.doc);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch rides';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRide();
    }, [id]);

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
                    onClick={fetchRide}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl my-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ride Details</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
                <div>
                    <span className="font-semibold">Pickup:</span> {ride?.pickupLocation}
                </div>
                <div>
                    <span className="font-semibold">Drop-off:</span> {ride?.dropOffLocation}
                </div>
                <div>
                    <span className="font-semibold">Type:</span> {ride?.rideType}
                </div>
                <div>
                    <span className="font-semibold">Status:</span>
                    <span className={`ml-1 px-2 py-1 rounded text-white text-sm ${ride?.status && getStatusColor(ride?.status)}`}>
                        {ride?.status}
                    </span>
                </div>
                <div>
                    <span className="font-semibold">Fare:</span> Rs {ride?.proposedFare}
                </div>
                <div>
                    <span className="font-semibold">Driver:</span> {ride?.driverName || 'Not assigned'}
                </div>
                <div>
                    <span className="font-semibold">Requested At:</span> {ride?.createdAt && formatDate(ride?.createdAt)}
                </div>
                {ride?.completedAt && (
                    <div>
                        <span className="font-semibold">Completed At:</span> {formatDate(ride.completedAt)}
                    </div>
                )}
                {ride?.status === "completed" && (
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
