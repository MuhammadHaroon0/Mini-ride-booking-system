export interface Ride {

    _id: string;
    pickupLocation: string;
    dropOffLocation: string;
    rideType: 'bike' | 'car' | 'rickshaw';
    status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    proposedFare: number;
    driver?: { name: string, email: string };
    createdAt: string;
    completedAt?: string;
    estimatedTime?: string;
}


export interface RideRequest {
    _id: string;
    user: { name: string, email: string };
    pickupLocation: string;
    dropOffLocation: string;
    rideType: 'bike' | 'car' | 'rickshaw';
    proposedFare: number;
    createdAt: Date;
    status: 'requested' | 'accepted' | 'rejected' | "completed";
}