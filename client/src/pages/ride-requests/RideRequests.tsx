import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { RideRequest } from "../../types";
import RideCard from "../../components/RideCard";
import Button from "../../components/Button";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision";
import apiRoutes from "../../utils/apiRoutes";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

interface Zone {
    id: string;
    name: string;
    areas: string[];
}

const ZONES: Zone[] = [
    {
        id: "zone1",
        name: "Zone 1",
        areas: ["Mall Road", "Jail Road", "Fortress Stadium", "Garhi Shahu"]
    },
    {
        id: "zone2",
        name: "Zone 2",
        areas: ["Bahria Town", "Thokar Niaz Baig", "Shahkam Chowk", "Park View"]
    },
    {
        id: "zone3",
        name: "Zone 3",
        areas: ["Johar Town", "Model Town", "Township", "Iqbal Town"]
    },
    {
        id: "zone4",
        name: "Zone 4",
        areas: ["Dha", "Airport", "Barki Road", "Bhatta Chowk"]
    }
];

export const RideRequests = () => {
    const [rides, setRides] = useState<RideRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingRides, setProcessingRides] = useState<Set<string>>(new Set());
    const [available, setAvailable] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [showZoneSelection, setShowZoneSelection] = useState(false);
    const [zoneLoading, setZoneLoading] = useState(false);
    const navigate = useNavigate()

    const fetchRidesForZone = async (zone: string[]) => {
        try {
            setLoading(true);

            const response = await axios.post(apiRoutes.getRidesByZone, { zone });
            setRides(response.data.doc || []);

        } catch (error) {
            console.error('Error fetching rides for zone:', error);
            toast.error('Failed to fetch ride requests for selected zone');
        } finally {
            setLoading(false);
        }
    };

    const handleZoneSelect = async (zoneId: string, zone: string[]) => {
        setZoneLoading(true);
        try {
            setSelectedZone(zoneId);
            await fetchRidesForZone(zone);
            setShowZoneSelection(false);
            setAvailable(true);
            toast.success(`Now accepting rides in ${ZONES.find(z => z.id === zoneId)?.name}`);
        } catch (error) {
            toast.error('Failed to select zone');
        } finally {
            setZoneLoading(false);
        }
    };

    const handleStartAcceptingRides = () => {
        setShowZoneSelection(true);
    };

    const handleAcceptRide = async (rideId: string) => {
        setProcessingRides(prev => new Set(prev).add(rideId));
        console.log(rideId);

        try {
            await axios.patch(apiRoutes.changeRideStatus(rideId), { status: "accepted" });
            setRides(prev => prev.filter(ride => ride._id !== rideId));
            toast.success('Ride accepted successfully!');
            navigate('/accepted-rides')
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
            await axios.patch(apiRoutes.changeRideStatus(rideId), { status: "rejected" });
            setRides(prev => prev.filter(ride => ride._id !== rideId));
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

    const handleGoOffline = () => {
        setAvailable(false);
        setSelectedZone(null);
        setRides([]);
        toast.success('You are now offline');
    };

    if (showZoneSelection) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                            Select Your Zone
                        </h2>
                        <p className="text-gray-600 mb-8 text-center">
                            Choose the zone where you want to accept rides
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                            {ZONES.map((zone) => (
                                <div
                                    key={zone.id}
                                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => handleZoneSelect(zone.id, zone.areas)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {zone.name}
                                        </h3>
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 transition-opacity"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 font-medium">Areas covered:</p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {zone.areas.map((area, index) => (
                                                <li key={index} className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                                    {area}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <Button
                                label="Cancel"
                                onClick={() => setShowZoneSelection(false)}
                                className="bg-gray-500 hover:bg-gray-600 rounded-lg px-8"
                            />
                        </div>
                    </div>
                </div>

                {zoneLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700">Setting up your zone...</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (loading)
        return <Loading />

    if (!available) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center">
                <BackgroundBeamsWithCollision>
                    <div className="flex flex-col gap-8">
                        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                            What&apos;s cooler than a shortcut? {" "}
                            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                    <span className="">Booking your ride in one tap.</span>
                                </div>
                                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                                    <span className="">Booking your ride in one tap.</span>
                                </div>
                            </div>
                        </h2>
                        <Button
                            label="Click to start accepting rides now"
                            onClick={handleStartAcceptingRides}
                            className="mx-auto rounded-2xl py-4"
                        />
                    </div>
                </BackgroundBeamsWithCollision>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex w-full items-center justify-between">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Available Rides - {ZONES.find(z => z.id === selectedZone)?.name}
                        </h1>
                        <p className="text-gray-600">
                            {rides.length} ride{rides.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            label="Change Zone"
                            onClick={() => setShowZoneSelection(true)}
                            className="bg-blue-500 hover:bg-blue-600 rounded-2xl"
                        />
                        <Button
                            label="Go Offline"
                            onClick={handleGoOffline}
                            className="bg-red-500 hover:bg-red-600 rounded-2xl"
                        />
                    </div>
                </div>

                {rides.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides available</h3>
                        <p className="text-gray-600">
                            Check back later for new ride requests in {ZONES.find(z => z.id === selectedZone)?.name}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {rides.map(ride => (
                            <RideCard
                                key={ride._id}
                                ride={ride}
                                onAccept={handleAcceptRide}
                                onReject={handleRejectRide}
                                isProcessing={processingRides.has(ride._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};