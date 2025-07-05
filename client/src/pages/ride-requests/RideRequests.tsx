import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { RideRequest } from "../../types";
import RideCard from "./RideCard";
import Button from "../../components/Button";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision";

export const RideRequests = () => {
    const [rides, setRides] = useState<RideRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingRides, setProcessingRides] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchRides = async () => {
            try {
                setLoading(true);

                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockRides: RideRequest[] = [
                    {
                        id: '1',
                        customerId: 'cust_001',
                        customerName: 'Ahmed Khan',
                        customerRating: 4.8,
                        pickupLocation: 'Mall Road',
                        dropOffLocation: 'Airport',
                        rideType: 'car',
                        proposedFare: 800,
                        distance: 12.5,
                        estimatedTime: '25 min',
                        requestedAt: new Date(Date.now() - 5 * 60 * 1000),
                        status: 'pending'
                    },
                    {
                        id: '2',
                        customerId: 'cust_002',
                        customerName: 'Sarah Ali',
                        customerRating: 4.6,
                        pickupLocation: 'Johar Town',
                        dropOffLocation: 'University',
                        rideType: 'bike',
                        proposedFare: 250,
                        distance: 5.2,
                        estimatedTime: '15 min',
                        requestedAt: new Date(Date.now() - 10 * 60 * 1000),
                        status: 'pending'
                    },
                    {
                        id: '3',
                        customerId: 'cust_003',
                        customerName: 'Muhammad Hassan',
                        customerRating: 4.9,
                        pickupLocation: 'Model Town',
                        dropOffLocation: 'Railway Station',
                        rideType: 'rickshaw',
                        proposedFare: 180,
                        distance: 3.8,
                        estimatedTime: '12 min',
                        requestedAt: new Date(Date.now() - 15 * 60 * 1000),
                        status: 'pending'
                    },
                    {
                        id: '4',
                        customerId: 'cust_004',
                        customerName: 'Fatima Sheikh',
                        customerRating: 4.7,
                        pickupLocation: 'Garden Town',
                        dropOffLocation: 'Hospital',
                        rideType: 'car',
                        proposedFare: 450,
                        distance: 8.1,
                        estimatedTime: '18 min',
                        requestedAt: new Date(Date.now() - 20 * 60 * 1000),
                        status: 'pending'
                    }
                ];

                setRides(mockRides);
            } catch (error) {
                toast.error('Failed to fetch ride requests');
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    const handleAcceptRide = async (rideId: string) => {
        setProcessingRides(prev => new Set(prev).add(rideId));

        try {
            await axios.post(`/api/rides/${rideId}/accept`);

            setRides(prev => prev.filter(ride => ride.id !== rideId));

            toast.success('Ride accepted successfully!');
        } catch (error) {
            toast.error('Failed to accept ride. Please try again.');
        } finally {
            setProcessingRides(prev => {
                const newSet = new Set(prev);
                newSet.delete(rideId);
                return newSet;
            });
        }
    };

    const handleRejectRide = async (rideId: string) => {
        setProcessingRides(prev => new Set(prev).add(rideId));

        try {
            await axios.post(`/api/rides/${rideId}/reject`);

            setRides(prev => prev.filter(ride => ride.id !== rideId));

            toast.success('Ride rejected');
        } catch (error) {
            toast.error('Failed to reject ride. Please try again.');
        } finally {
            setProcessingRides(prev => {
                const newSet = new Set(prev);
                newSet.delete(rideId);
                return newSet;
            });
        }
    };

    const [available, setAvailable] = useState(false)


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ride requests...</p>
                </div>
            </div>
        );
    }

    if (!available)
        return (
            <div className="min-h-[80vh] flex justify-center items-center">
                <BackgroundBeamsWithCollision>
                    <div className="flex flex-col gap-8">

                        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                            What&apos;s cooler than Beams?{" "}
                            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                    <span className="">Exploding beams.</span>
                                </div>
                                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                                    <span className="">Exploding beams.</span>
                                </div>
                            </div>
                        </h2>
                        <Button label="Click to start accepting rides now" onClick={() => setAvailable(true)} className="mx-auto rounded-2xl py-4" />
                    </div>
                </BackgroundBeamsWithCollision>
            </div>
        )

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex w-full items-center justify-between">

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Rides</h1>
                        <p className="text-gray-600">
                            {rides.length} ride{rides.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                    <Button label="Click to mark yourself as unavailable" onClick={() => setAvailable(false)} className=" rounded-2xl" />
                </div>


                {rides.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides available</h3>
                        <p className="text-gray-600">Check back later for new ride requests</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {rides.map(ride => (
                            <RideCard
                                key={ride.id}
                                ride={ride}
                                onAccept={handleAcceptRide}
                                onReject={handleRejectRide}
                                isProcessing={processingRides.has(ride.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
