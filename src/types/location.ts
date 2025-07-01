// Types pour la géolocalisation
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  accuracy?: number;
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'undetermined';
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationState {
  currentLocation: Location | null;
  permissionStatus: LocationPermission;
  isLoading: boolean;
  error: string | null;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  zipCode?: string;
  country?: string;
  district?: string;
  region?: string;
}

// Utilitaires pour le calcul de distance
export interface DistanceCalculation {
  distance: number; // en km
  unit: 'km' | 'miles';
  duration?: string; // temps estimé
} 