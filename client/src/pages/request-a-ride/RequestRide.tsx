import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import apiRoutes from "../../utils/apiRoutes";

interface RideBookingFormData {
    pickupLocation: string;
    dropOffLocation: string;
    rideType: RideType;
    proposedFare?: number
}

interface FormError {
    pickupLocation?: string;
    dropOffLocation?: string;
    rideType?: string;
    proposedFare?: number
}

type RideType = 'bike' | 'car' | 'rickshaw';

interface RideTypeOption {
    value: RideType;
    label: string;
    icon: string;
}

interface LocationOption {
    value: string;
    label: string;
    zone: string;
}

const RequestRide = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<RideBookingFormData>({
        pickupLocation: "",
        dropOffLocation: "",
        rideType: "car",
    });
    const [errors, setErrors] = useState<FormError>({});
    const navigate = useNavigate()
    const locations: LocationOption[] = [
        { value: "Mall Road", label: "Mall Road", zone: "Zone 1" },
        { value: "Jail Road", label: "Jail Road", zone: "Zone 1" },
        { value: "Fortress Stadium", label: "Fortress Stadium", zone: "Zone 1" },
        { value: "Garhi Shahu", label: "Garhi Shahu", zone: "Zone 1" },

        { value: "Bahria Town", label: "Bahria Town", zone: "Zone 2" },
        { value: "Thokar Niaz Baig", label: "Thokar Niaz Baig", zone: "Zone 2" },
        { value: "Shahkam Chowk", label: "Shahkam Chowk", zone: "Zone 2" },
        { value: "Park View", label: "Park View", zone: "Zone 2" },

        { value: "Johar Town", label: "Johar Town", zone: "Zone 3" },
        { value: "Model Town", label: "Model Town", zone: "Zone 3" },
        { value: "Township", label: "Township", zone: "Zone 3" },
        { value: "Iqbal Town", label: "Iqbal Town", zone: "Zone 3" },

        { value: "Dha", label: "Dha", zone: "Zone 4" },
        { value: "Airport", label: "Airport", zone: "Zone 4" },
        { value: "Barki Road", label: "Barki Road", zone: "Zone 4" },
        { value: "Bhatta Chowk", label: "Bhatta Chowk", zone: "Zone 4" },
    ];


    const rideTypes: RideTypeOption[] = [
        { value: "bike", label: "Bike", icon: "🏍️" },
        { value: "car", label: "Car", icon: "🚗" },
        { value: "rickshaw", label: "Rickshaw", icon: "🛺" }
    ];

    const validateForm = (): boolean => {
        const newErrors: FormError = {};

        if (!formData.pickupLocation.trim()) {
            newErrors.pickupLocation = "Pickup location is required";
        }

        if (!formData.dropOffLocation.trim()) {
            newErrors.dropOffLocation = "Drop-off location is required";
        }

        if (formData.pickupLocation === formData.dropOffLocation && formData.pickupLocation.trim()) {
            newErrors.dropOffLocation = "Drop-off location must be different from pickup location";
        }

        if (!formData.rideType) {
            newErrors.rideType = "Please select a ride type";
        }
        if (!formData.proposedFare) {
            newErrors.rideType = "Please enter your proposed fare";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormError]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleRideTypeChange = (rideType: RideType) => {
        setFormData(prev => ({
            ...prev,
            rideType
        }));

        if (errors.rideType) {
            setErrors(prev => ({
                ...prev,
                rideType: undefined
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post(apiRoutes.requestRide, formData);

            toast.success("Ride requested successfully! Looking for nearby drivers...", {
                duration: 4000,
            });

            setFormData({
                pickupLocation: "",
                dropOffLocation: "",
                rideType: "car",
                proposedFare: 0
            });

            navigate(`/ride-history`);

        } catch (error: any) {
            console.error("Ride booking error:", error);

            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                "Failed to book ride. Please try again.";

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex  w-full flex-row">
            <div className="hidden md:block w-full bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat"></div>
            <div className=" w-full bg-white py-6 px-12 mt-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Book Your Ride
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Location
                        </label>
                        <select
                            id="pickupLocation"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select pickup location</option>

                            <optgroup label="">
                                {locations.map((location) => (
                                    <option key={location.value} value={location.value}>
                                        {location.label}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        {errors.pickupLocation && (
                            <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="dropOffLocation" className="block text-sm font-medium text-gray-700 mb-2">
                            Drop-off Location
                        </label>
                        <select
                            id="dropOffLocation"
                            name="dropOffLocation"
                            value={formData.dropOffLocation}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select drop-off location</option>

                            <optgroup label="">
                                {locations.map((location) => (
                                    <option key={location.value} value={location.value}>
                                        {location.label}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        {errors.dropOffLocation && (
                            <p className="mt-1 text-sm text-red-600">{errors.dropOffLocation}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Choose Ride Type
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {rideTypes.map((ride) => (
                                <div
                                    key={ride.value}
                                    onClick={() => handleRideTypeChange(ride.value)}
                                    className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 ${formData.rideType === ride.value
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{ride.icon}</span>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{ride.label}</h3>
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 ${formData.rideType === ride.value
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-300"
                                            }`}>
                                            {formData.rideType === ride.value && (
                                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.rideType && (
                            <p className="mt-1 text-sm text-red-600">{errors.rideType}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <div>
                            <label
                                htmlFor="proposedFare"
                                className="block mb-2 text-sm font-medium"
                            >
                                Your proposed fare
                            </label>
                            <input
                                type="text"
                                name="proposedFare"
                                id="proposedFare"
                                className="shadow-xs  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md  block text-black w-full px-5 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                placeholder="200"
                                value={formData.proposedFare}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        {errors.proposedFare && (
                            <p className="text-red-500 text-xs mt-1">{errors.proposedFare}</p>
                        )}
                    </div>

                    <Button
                        label={isSubmitting ? "Booking Ride..." : "Book Ride"}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    />

                </form>

                {formData.pickupLocation && formData.dropOffLocation && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Route:</span> {formData.pickupLocation} → {formData.dropOffLocation}
                        </p>

                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestRide;