export interface Ride {
    id: string;
    pickupLocation: string;
    dropOffLocation: string;
    rideType: 'bike' | 'car' | 'rickshaw';
    status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    fare: number;
    driverName?: string;
    requestedAt: string;
    completedAt?: string;
    estimatedTime?: string;
}


export interface RideRequest {
    id: string;
    customerId: string;
    customerName: string;
    customerRating: number;
    pickupLocation: string;
    dropOffLocation: string;
    rideType: 'bike' | 'car' | 'rickshaw';
    proposedFare: number;
    distance: number;
    estimatedTime: string;
    requestedAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
    customerPhone?: string;
}