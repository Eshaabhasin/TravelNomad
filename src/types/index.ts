// ─── Location Types ─────────────────────────────────────────────────────────
export interface LatLng {
  lat: number;
  lng: number;
}

export interface SelectedLocation extends LatLng {
  placeId?: string;
  name?: string;
  address?: string;
}

// ─── Preference Filter Types ─────────────────────────────────────────────────
export type PreferenceId =
  | "scenic"
  | "budget"
  | "food"
  | "nightlife"
  | "quiet"
  | "less-walking";

export interface PreferenceFilter {
  id: PreferenceId;
  label: string;
  icon: string;
}

// ─── AI Recommendation Types ─────────────────────────────────────────────────
export interface Place {
  name: string;
  reason: string;
  rating?: number;
  distance?: string;
  category?: string;
  image?: string;
}

export interface Recommendations {
  summary: string;
  places: Place[];
  routeStyle: string;
  estimatedTime?: string;
}

// ─── Chat Message Types ───────────────────────────────────────────────────────
export type MessageRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// ─── API Request / Response ───────────────────────────────────────────────────
export interface RecommendationRequest {
  location: LatLng;
  preferences: string[];
  timeLimit?: string;
}

export interface ChatRequest {
  message: string;
  location?: LatLng;
  preferences?: string[];
  history?: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>;
}

export interface ChatResponse {
  reply: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

// ─── Route Types ─────────────────────────────────────────────────────────────
export interface RouteInfo {
  origin: LatLng;
  destination: LatLng;
  waypoints?: LatLng[];
  travelMode?: "DRIVING" | "WALKING" | "TRANSIT";
}
