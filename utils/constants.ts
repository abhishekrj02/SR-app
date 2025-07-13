import { ReturnReason } from '../types';

export const COLORS = {
  primary: '#00D4FF',
  secondary: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFE66D',
  error: '#FF6B6B',
  background: '#000000',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#333333',
  overlay: 'rgba(0, 0, 0, 0.8)',
};

export const SIZES = {
  padding: 20,
  margin: 16,
  borderRadius: 12,
  buttonHeight: 50,
  cardHeight: 120,
};

export const FONTS = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
};

export const RETURN_REASONS: ReturnReason[] = [
  {
    id: 'damaged',
    title: 'Damaged Item',
    description: 'Product arrived damaged or broke during use',
    icon: 'warning',
    color: '#FF6B6B',
    mlFocus: ['cracks', 'dents', 'scratches', 'holes'],
    requiresPhotos: true,
    photoInstructions: [
      'Take clear photos of all damage',
      'Show close-ups of affected areas',
      'Include overall product view',
      'Ensure good lighting'
    ]
  },
  {
    id: 'defective',
    title: 'Defective/Not Working',
    description: 'Product does not function as expected',
    icon: 'settings',
    color: '#FFE66D',
    mlFocus: ['functionality', 'missing_parts', 'assembly_issues'],
    requiresPhotos: true,
    photoInstructions: [
      'Show the defective part clearly',
      'Include all product components',
      'Demonstrate the issue if possible'
    ]
  },
  {
    id: 'wrong_size',
    title: 'Wrong Size',
    description: 'Item is too big, too small, or incorrect size',
    icon: 'resize',
    color: '#4ECDC4',
    mlFocus: ['size_verification', 'label_check'],
    requiresPhotos: true,
    photoInstructions: [
      'Show size label clearly',
      'Compare with measurement if possible',
      'Include overall product view'
    ]
  },
  {
    id: 'color_faded',
    title: 'Color Faded/Wrong Color',
    description: 'Color is different from description or faded',
    icon: 'color-palette',
    color: '#9B59B6',
    mlFocus: ['color_analysis', 'fading_detection'],
    requiresPhotos: true,
    photoInstructions: [
      'Show color variation clearly',
      'Include good lighting photos',
      'Compare with original if available'
    ]
  },
  {
    id: 'not_as_described',
    title: 'Not as Described',
    description: 'Product does not match the description',
    icon: 'document-text',
    color: '#FF9500',
    mlFocus: ['feature_verification', 'description_match'],
    requiresPhotos: true,
    photoInstructions: [
      'Show discrepancy clearly',
      'Include product labels',
      'Document missing features'
    ]
  },
  {
    id: 'quality_issues',
    title: 'Poor Quality',
    description: 'Product quality is below expectations',
    icon: 'star',
    color: '#FF6B6B',
    mlFocus: ['quality_assessment', 'wear_detection'],
    requiresPhotos: true,
    photoInstructions: [
      'Show quality issues clearly',
      'Include material defects',
      'Document poor craftsmanship'
    ]
  },
  {
    id: 'changed_mind',
    title: 'Changed Mind',
    description: 'No longer need this item',
    icon: 'heart-dislike',
    color: '#95A5A6',
    mlFocus: ['condition_check', 'wear_assessment'],
    requiresPhotos: true,
    photoInstructions: [
      'Show item in original condition',
      'Include all original packaging',
      'Demonstrate minimal use'
    ]
  }
];

export const PHOTO_TYPES = {
  OVERVIEW: 'overview',
  DAMAGE: 'damage',
  LABEL: 'label',
  CLOSEUP: 'closeup'
} as const;

export const RETURN_STATUS = {
  INITIATED: 'initiated',
  SCANNING: 'scanning',
  ANALYZING: 'analyzing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVIEW: 'review',
  COMPLETED: 'completed'
} as const;

export const ML_CONFIDENCE_THRESHOLD = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

export const CAMERA_SETTINGS = {
  quality: 0.8,
  allowsEditing: false,
  aspect: [4, 3] as [number, number],
  base64: false
};

export const AR_GUIDE_STEPS = [
  {
    id: 'overview',
    title: 'Overall View',
    instruction: 'Position the entire product in the frame',
    targetType: 'overview',
    visualGuide: 'ar_overview_guide',
    validationRules: ['full_product_visible', 'good_lighting', 'stable_position'],
    isRequired: true
  },
  {
    id: 'damage',
    title: 'Damage Focus',
    instruction: 'Focus on the damaged or defective area',
    targetType: 'damage',
    visualGuide: 'ar_damage_guide',
    validationRules: ['damage_visible', 'close_enough', 'clear_focus'],
    isRequired: true
  },
  {
    id: 'label',
    title: 'Product Label',
    instruction: 'Capture the product label or size tag',
    targetType: 'label',
    visualGuide: 'ar_label_guide',
    validationRules: ['label_readable', 'text_clear', 'full_label_visible'],
    isRequired: false
  }
];