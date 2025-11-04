/**
 * Report type (what is being reported)
 */
export type ReportTargetType = 'post' | 'comment' | 'user';

/**
 * Report category/reason
 */
export type ReportCategory =
  | 'spam'
  | 'inappropriate'
  | 'scam'
  | 'harassment'
  | 'fake'
  | 'other';

/**
 * Report status
 */
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

/**
 * Report document structure
 */
export interface Report {
  id: string;

  // Reporter info
  reporterId: string;
  reporterUsername: string;

  // Target info
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string; // User who owns the reported content
  targetOwnerUsername?: string;

  // Report details
  category: ReportCategory;
  description?: string;

  // Status
  status: ReportStatus;

  // Timestamps
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin ID

  // Admin notes
  adminNotes?: string;
}
