import { db } from '../config/firebaseAdmin';
import admin from 'firebase-admin';

/**
 * Generic service for Firestore operations
 * Provides reusable methods for database interactions
 */
export class FirestoreService {
  /**
   * Get a single document by ID
   * @param collection - Collection name
   * @param id - Document ID
   * @returns Document data with ID or null if not found
   */
  async getDocument<T>(collection: string, id: string): Promise<(T & { id: string }) | null> {
    try {
      const doc = await db.collection(collection).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as T & { id: string };
    } catch (error) {
      console.error(`Error getting document from ${collection}:`, error);
      throw new Error('Failed to fetch document');
    }
  }

  /**
   * Query documents with filters, ordering, and pagination
   * @param collection - Collection name
   * @param options - Query options
   * @returns Array of documents
   */
  async queryDocuments<T>(
    collection: string,
    options: {
      filters?: Array<[string, FirebaseFirestore.WhereFilterOp, any]>;
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      startAfter?: any;
    } = {}
  ): Promise<(T & { id: string })[]> {
    try {
      let query: FirebaseFirestore.Query = db.collection(collection);

      // Apply filters
      if (options.filters && options.filters.length > 0) {
        options.filters.forEach(([field, op, value]) => {
          query = query.where(field, op, value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.orderBy(options.orderBy.field, options.orderBy.direction);
      }

      // Apply pagination
      if (options.startAfter) {
        query = query.startAfter(options.startAfter);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & { id: string })[];
    } catch (error) {
      console.error(`Error querying ${collection}:`, error);
      throw new Error('Failed to query documents');
    }
  }

  /**
   * Create a new document
   * @param collection - Collection name
   * @param data - Document data
   * @returns Created document with ID
   */
  async createDocument<T>(
    collection: string,
    data: T
  ): Promise<T & { id: string }> {
    try {
      const docData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await db.collection(collection).add(docData);
      const doc = await docRef.get();

      return {
        id: docRef.id,
        ...doc.data(),
      } as T & { id: string };
    } catch (error) {
      console.error(`Error creating document in ${collection}:`, error);
      throw new Error('Failed to create document');
    }
  }

  /**
   * Create a document with a specific ID
   * @param collection - Collection name
   * @param id - Document ID
   * @param data - Document data
   */
  async setDocument<T>(
    collection: string,
    id: string,
    data: T,
    merge: boolean = false
  ): Promise<void> {
    try {
      const docData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection(collection).doc(id).set(docData, { merge });
    } catch (error) {
      console.error(`Error setting document in ${collection}:`, error);
      throw new Error('Failed to set document');
    }
  }

  /**
   * Update a document
   * @param collection - Collection name
   * @param id - Document ID
   * @param data - Partial document data to update
   */
  async updateDocument<T>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection(collection).doc(id).update(updateData);
    } catch (error) {
      console.error(`Error updating document in ${collection}:`, error);
      throw new Error('Failed to update document');
    }
  }

  /**
   * Delete a document
   * @param collection - Collection name
   * @param id - Document ID
   */
  async deleteDocument(collection: string, id: string): Promise<void> {
    try {
      await db.collection(collection).doc(id).delete();
    } catch (error) {
      console.error(`Error deleting document from ${collection}:`, error);
      throw new Error('Failed to delete document');
    }
  }

  /**
   * Check if a document exists
   * @param collection - Collection name
   * @param id - Document ID
   * @returns True if document exists
   */
  async documentExists(collection: string, id: string): Promise<boolean> {
    try {
      const doc = await db.collection(collection).doc(id).get();
      return doc.exists;
    } catch (error) {
      console.error(`Error checking document existence in ${collection}:`, error);
      return false;
    }
  }

  /**
   * Add item to array field
   * @param collection - Collection name
   * @param id - Document ID
   * @param field - Field name
   * @param value - Value to add
   */
  async arrayUnion(
    collection: string,
    id: string,
    field: string,
    value: any
  ): Promise<void> {
    try {
      await db.collection(collection).doc(id).update({
        [field]: admin.firestore.FieldValue.arrayUnion(value),
      });
    } catch (error) {
      console.error(`Error adding to array in ${collection}:`, error);
      throw new Error('Failed to add to array');
    }
  }

  /**
   * Remove item from array field
   * @param collection - Collection name
   * @param id - Document ID
   * @param field - Field name
   * @param value - Value to remove
   */
  async arrayRemove(
    collection: string,
    id: string,
    field: string,
    value: any
  ): Promise<void> {
    try {
      await db.collection(collection).doc(id).update({
        [field]: admin.firestore.FieldValue.arrayRemove(value),
      });
    } catch (error) {
      console.error(`Error removing from array in ${collection}:`, error);
      throw new Error('Failed to remove from array');
    }
  }

  /**
   * Run a batch operation
   * @param operations - Array of operations to run
   */
  async runBatch(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      collection: string;
      id?: string;
      data?: any;
    }>
  ): Promise<void> {
    try {
      const batch = db.batch();

      operations.forEach(op => {
        const docRef = op.id
          ? db.collection(op.collection).doc(op.id)
          : db.collection(op.collection).doc();

        switch (op.type) {
          case 'create':
            batch.set(docRef, op.data);
            break;
          case 'update':
            batch.update(docRef, op.data);
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error running batch operation:', error);
      throw new Error('Failed to run batch operation');
    }
  }
}

// Export singleton instance
export default new FirestoreService();
