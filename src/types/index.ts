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
