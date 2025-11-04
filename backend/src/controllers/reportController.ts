import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import firestoreService from '../services/firestore.service';
import { COLLECTIONS } from '../shared/constants/firebasePaths';
import { Report, ReportCategory, ReportTargetType } from '../shared/types/report.types';
import { asyncHandler } from '../middleware/errorHandler';
import { sanitizeText } from '../utils/sanitize';
import admin from 'firebase-admin';

export class ReportController {
  /**
   * POST /api/reports
   * Create a new report
   * Protected route - requires authentication
   */
  createReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.uid;
    const { targetType, targetId, category, description } = req.body;

    // Validation
    if (!targetType || !['post', 'comment', 'user'].includes(targetType)) {
      res.status(400).json({ error: 'Invalid targetType. Must be: post, comment, or user' });
      return;
    }

    if (!targetId || typeof targetId !== 'string') {
      res.status(400).json({ error: 'targetId is required' });
      return;
    }

    if (!category || !['spam', 'inappropriate', 'scam', 'harassment', 'fake', 'other'].includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    // Cannot report yourself
    if (targetType === 'user' && targetId === userId) {
      res.status(400).json({ error: 'You cannot report yourself' });
      return;
    }

    // Get reporter info
    const reporter = await firestoreService.getDocument<any>(COLLECTIONS.USERS, userId);
    if (!reporter) {
      res.status(404).json({ error: 'Reporter not found' });
      return;
    }

    // Get target info
    let targetOwnerId: string | undefined;
    let targetOwnerUsername: string | undefined;

    if (targetType === 'user') {
      const targetUser = await firestoreService.getDocument<any>(COLLECTIONS.USERS, targetId);
      if (!targetUser) {
        res.status(404).json({ error: 'Target user not found' });
        return;
      }
      targetOwnerId = targetId;
      targetOwnerUsername = targetUser.username;
    } else if (targetType === 'post') {
      const post = await firestoreService.getDocument<any>(COLLECTIONS.POSTS, targetId);
      if (!post) {
        res.status(404).json({ error: 'Target post not found' });
        return;
      }
      targetOwnerId = post.authorId;
      targetOwnerUsername = post.authorUsername;
    } else if (targetType === 'comment') {
      // For comments, we need to find the post and then the comment
      // This is simplified - you might need to search through posts
      res.status(400).json({ error: 'Comment reporting not fully implemented yet' });
      return;
    }

    // Create report (only include description if it exists)
    const report: any = {
      id: admin.firestore().collection('_').doc().id,
      reporterId: userId,
      reporterUsername: reporter.username,
      targetType: targetType as ReportTargetType,
      targetId,
      targetOwnerId,
      targetOwnerUsername,
      category: category as ReportCategory,
      status: 'pending',
      createdAt: new Date(),
    };

    // Only add description if it's provided
    if (description && description.trim()) {
      report.description = sanitizeText(description);
    }

    await firestoreService.setDocument(COLLECTIONS.REPORTS, report.id, report);

    res.status(201).json({ message: 'Report submitted successfully', reportId: report.id });
  });

  /**
   * GET /api/reports
   * Get all reports (admin only)
   * Protected route - requires admin authentication
   */
  getReports = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, targetType, limit = 50 } = req.query;

    try {
      // Build Firestore query directly
      const db = admin.firestore();
      let query: FirebaseFirestore.Query = db.collection(COLLECTIONS.REPORTS);

      // Apply filters
      if (status) {
        query = query.where('status', '==', status as string);
      }

      if (targetType) {
        query = query.where('targetType', '==', targetType as string);
      }

      // Limit results
      query = query.limit(Number(limit));

      // Execute query
      const snapshot = await query.get();
      let reports: Report[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
        } as Report);
      });

      // Sort in memory by createdAt (newest first)
      reports = reports.sort((a, b) => {
        // Handle Firestore Timestamp objects or Date strings
        const getTime = (dateValue: any): number => {
          if (!dateValue) return 0;
          if (typeof dateValue === 'object' && 'toDate' in dateValue) {
            return dateValue.toDate().getTime();
          }
          return new Date(dateValue).getTime();
        };

        return getTime(b.createdAt) - getTime(a.createdAt);
      });

      res.json({ reports, total: reports.length });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  });

  /**
   * PUT /api/reports/:id
   * Update report status (admin only)
   * Protected route - requires admin authentication
   */
  updateReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const report = await firestoreService.getDocument<Report>(COLLECTIONS.REPORTS, id);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    const updates: Partial<Report> = {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user?.uid || 'admin', // Fallback to 'admin' if no user uid
    };

    if (adminNotes) {
      updates.adminNotes = sanitizeText(adminNotes);
    }

    await firestoreService.updateDocument(COLLECTIONS.REPORTS, id, updates);

    res.json({ message: 'Report updated successfully' });
  });
}

export default new ReportController();
