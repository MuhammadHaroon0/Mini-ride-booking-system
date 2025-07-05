
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const apiRoutes = {
    // Auth routes
    login: `${BASE_URL}/users/login`,
    signup: `${BASE_URL}/users/signup`,
    logout: `${BASE_URL}/users/logout`,
    getMe: `${BASE_URL}/users/get-me`,

    //Rides routes
    requestRide: `${BASE_URL}/rides`,
    getRideHistory: `${BASE_URL}/rides/history`,
    getRide: (id: string) => `${BASE_URL}/rides/${id}`
}

export default apiRoutes;