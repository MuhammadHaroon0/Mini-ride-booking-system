import { useEffect, useState } from "react";
import RideCard from "../../components/RideCard"
import type { RideRequest } from "../../types";
import apiRoutes from "../../utils/apiRoutes";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const AcceptedRides = () => {
    const [rides, setRides] = useState<RideRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingRides, setProcessingRides] = useState<Set<string>>(new Set());
    const handleCompleteRide = async (rideId: string) => {
        setProcessingRides(prev => new Set(prev).add(rideId));
        try {
            await axios.patch(apiRoutes.changeRideStatus(rideId), { status: "completed" });
            setRides(prev => prev.filter(ride => ride._id !== rideId));
            toast.success('Ride completed successfully!');
        } catch (error) {
            toast.error('Failed to complete ride. Please try again.');
        } finally {
            setProcessingRides(prev => {
                const newSet = new Set(prev);
                newSet.delete(rideId);
                return newSet;
            });
        }
    };

    const fetchAcceptedRides = async () => {
        try {
            setLoading(true);
            const response = await axios.post(apiRoutes.getRidesByStatus, { status: "accepted" });
            setRides(response.data.doc || []);
        } catch (error) {
            toast.error('Failed to fetch accepted ride');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAcceptedRides()
    }, [])

    if (loading)
        return <Loading />
    return (
        <>
            <h1 className="text-3xl font-semibold md:p-8 p-4 md:pl-12 pl-8">Accepted Rides</h1>
            <div className="grid max-w-4xl mx-auto my-8 gap-6 md:grid-cols-2">
                {
                    rides.length === 0 ? (
                        <div className="mx-auto col-span-2 text-center py-12">
                            <div className="text-6xl mb-4">🚗</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides available</h3>
                            <p className="text-gray-600">
                                No rides for now
                            </p>
                        </div>
                    ) : rides.map(ride => (
                        <RideCard
                            key={ride._id}
                            ride={ride}
                            onAccept={handleCompleteRide}
                            type="Complete"
                            isProcessing={processingRides.has(ride._id)}
                        />
                    ))
                }
            </div>
        </>
    )
}

export default AcceptedRides