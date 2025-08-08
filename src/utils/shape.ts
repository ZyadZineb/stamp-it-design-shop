
export type InternalShape = 'rectangle' | 'circle' | 'ellipse' | 'square';
export type PreviewShape = 'rectangle' | 'circle' | 'oval';
export type TemplateShape = 'rectangle' | 'circle' | 'square';

// Map internal or template shapes to preview-friendly shapes (for UI components expecting 'oval')
export const toPreviewShape = (shape: InternalShape | TemplateShape): PreviewShape => {
  switch (shape) {
    case 'ellipse':
      return 'oval';
    case 'square':
      return 'rectangle';
    default:
      return shape as Exclude<PreviewShape, 'oval'>; // 'rectangle' | 'circle'
  }
};

// Map preview or internal shapes to canvas drawing shapes (canvas uses 'ellipse')
export const toCanvasShape = (shape: PreviewShape | InternalShape): InternalShape => {
  switch (shape) {
    case 'oval':
      return 'ellipse';
    default:
      return shape as InternalShape; // rectangle | circle | ellipse | square
  }
};

// Map internal or preview shapes to cart shapes (cart uses 'oval')
export const toCartShape = (shape: InternalShape | PreviewShape): PreviewShape => {
  switch (shape) {
    case 'ellipse':
      return 'oval';
    case 'square':
      return 'rectangle';
    default:
      return shape as Exclude<PreviewShape, 'oval'>; // 'rectangle' | 'circle'
  }
};

// Map internal or preview shapes to template shapes (templates use 'square' not 'ellipse')
export const toTemplatesShape = (shape: InternalShape | PreviewShape): TemplateShape => {
  switch (shape) {
    case 'ellipse':
      return 'square';
    case 'oval':
      return 'circle';
    default:
      return shape as TemplateShape; // rectangle | circle | square
  }
};
