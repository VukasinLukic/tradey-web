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

    // Create report
    const report: Report = {
      id: admin.firestore().collection('_').doc().id,
      reporterId: userId,
      reporterUsername: reporter.username,
      targetType: targetType as ReportTargetType,
      targetId,
      targetOwnerId,
      targetOwnerUsername,
      category: category as ReportCategory,
      description: description ? sanitizeText(description) : undefined,
      status: 'pending',
      createdAt: new Date(),
    };

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

    const filters: Array<[string, FirebaseFirestore.WhereFilterOp, any]> = [];

    if (status) {
      filters.push(['status', '==', status as string]);
    }

    if (targetType) {
      filters.push(['targetType', '==', targetType as string]);
    }

    const reports = await firestoreService.queryDocuments<Report>(
      COLLECTIONS.REPORTS,
      {
        filters,
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: Number(limit),
      }
    );

    res.json({ reports, total: reports.length });
  });

  /**
   * PUT /api/reports/:id
   * Update report status (admin only)
   * Protected route - requires admin authentication
   */
  updateReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;
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
      reviewedBy: userId,
    };

    if (adminNotes) {
      updates.adminNotes = sanitizeText(adminNotes);
    }

    await firestoreService.updateDocument(COLLECTIONS.REPORTS, id, updates);

    res.json({ message: 'Report updated successfully' });
  });
}

export default new ReportController();
