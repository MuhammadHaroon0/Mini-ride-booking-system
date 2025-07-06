import Button from "./Button";
import type { RideRequest } from "../types";

interface RideCardProps {
    ride: RideRequest;
    onAccept: (rideId: string) => void;
    onReject?: (rideId: string) => void;
    isProcessing: boolean;
    type?: string
}

const RideCard: React.FC<RideCardProps> = ({ ride, onAccept, onReject, isProcessing, type = "Accept" }) => {
    const getRideIcon = (rideType: string) => {
        switch (rideType) {
            case 'bike': return '🏍️';
            case 'car': return '🚗';
            case 'rickshaw': return '🛺';
            default: return '🚗';
        }
    };

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };



    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                            {ride.user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{ride.user.name}</h3>
                        <div className="flex items-center space-x-2">

                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{getTimeAgo(ride.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getRideIcon(ride.rideType)}</span>
                        <span className="text-sm font-medium text-gray-600 capitalize">{ride.rideType}</span>
                    </div>
                </div>
            </div>

            {/* Route Information */}
            <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center mt-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-6 bg-gray-300"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-900">📍 {ride.pickupLocation}</p>
                            <p className="text-xs text-gray-500">Pickup</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">🏁 {ride.dropOffLocation}</p>
                            <p className="text-xs text-gray-500">Drop-off</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <p className="text-lg font-bold text-green-600">PKR {ride.proposedFare}</p>
                    <p className="text-xs text-gray-500">Fare</p>
                </div>

            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
                {onReject && <Button
                    label={isProcessing ? 'Processing...' : 'Reject'}
                    onClick={() => onReject(ride._id)}
                    disabled={isProcessing}
                    intent="secondary"
                    className="flex-1  py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                />}

                <Button
                    label={isProcessing ? 'Processing...' : type}
                    onClick={() => onAccept(ride._id)}
                    disabled={isProcessing}
                    className="flex-1  text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                />


            </div>
        </div >
    );
};

export default RideCard
