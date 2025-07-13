// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  returnEligible: boolean;
  returnWindow: number; // days
  condition: 'new' | 'used' | 'damaged';
  purchaseDate: string;
  orderNumber: string;
}

// Return Reason Types
export interface ReturnReason {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  mlFocus: string[]; // What the ML model should focus on
  requiresPhotos: boolean;
  photoInstructions: string[];
}

// Return Process Types
export interface ReturnProcess {
  id: string;
  productId: string;
  userId: string;
  reasonId: string;
  status: 'initiated' | 'scanning' | 'analyzing' | 'approved' | 'rejected' | 'review' | 'completed';
  createdAt: string;
  updatedAt: string;
  photos: string[];
  mlResults?: MLAnalysisResult;
  refundAmount?: number;
  trackingNumber?: string;
}

// ML Analysis Types
export interface MLAnalysisResult {
  overallScore: number;
  confidence: number;
  defectsFound: DefectResult[];
  fraudCheck: FraudResult;
  wearLevel: WearLevel;
  recommendation: 'approve' | 'reject' | 'review';
  reasoning: string;
}

export interface DefectResult {
  type: 'hole' | 'stain' | 'crack' | 'fade' | 'tear' | 'scratch' | 'dent';
  confidence: number;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severity: 'minor' | 'moderate' | 'severe';
}

export interface FraudResult {
  isOriginalItem: boolean;
  confidence: number;
  matchedFeatures: string[];
  suspiciousIndicators: string[];
}

export interface WearLevel {
  level: 'new' | 'light' | 'moderate' | 'heavy';
  score: number;
  details: string[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Camera/AR Types
export interface PhotoCapture {
  id: string;
  uri: string;
  timestamp: string;
  type: 'overview' | 'damage' | 'label' | 'closeup';
  metadata: {
    lighting: 'good' | 'poor' | 'excellent';
    angle: 'front' | 'back' | 'side' | 'top' | 'bottom';
    focus: 'sharp' | 'blurry';
  };
}

export interface ARGuideStep {
  id: string;
  title: string;
  instruction: string;
  targetType: 'overview' | 'damage' | 'label' | 'closeup';
  visualGuide: string; // Unity AR guide identifier
  validationRules: string[];
  isRequired: boolean;
}

// Navigation Types
export interface NavigationParams {
  product?: string;
  reason?: string;
  photos?: string;
  returnId?: string;
}

// App State Types
export interface AppState {
  currentReturn?: ReturnProcess;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  isLoading: boolean;
  error?: string;
}