import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Hostel,
  Block,
  Room,
  Facility,
  MaintenanceRequest,
  MaintenanceStatus,
  MaintenanceUpdate,
  Announcement,
  FacilityBooking,
  CommunityPost,
  CommunityComment,
  NotificationItem,
  UtilityReading,
} from '../types';
import {
  initialHostel,
  initialBlocks,
  initialRooms,
  initialFacilities,
  initialMaintenanceRequests,
  initialAnnouncements,
  initialBookings,
  initialCommunityPosts,
  initialCommunityComments,
  initialNotifications,
  initialUtilityReadings,
} from '../lib/demoData';

interface HostelState {
  hostel: Hostel;
  blocks: Block[];
  rooms: Room[];
  facilities: Facility[];
  requests: MaintenanceRequest[];
  updates: MaintenanceUpdate[];
  announcements: Announcement[];
  bookings: FacilityBooking[];
  posts: CommunityPost[];
  comments: CommunityComment[];
  notifications: NotificationItem[];
  utilityReadings: UtilityReading[];

  // Maintenance Actions
  addMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => MaintenanceRequest;
  updateRequestStatus: (
    id: string,
    status: MaintenanceStatus,
    updatedBy: string,
    authorName: string,
    authorRole: any,
    notes?: string,
    materials?: string[],
    evidenceUrl?: string
  ) => void;
  assignStaff: (requestId: string, staffId: string, staffName: string) => void;
  rateResolution: (requestId: string, rating: number, feedback?: string) => void;
  findDuplicates: (roomNumber: string, blockName: string, category: string, facilityId?: string) => MaintenanceRequest[];

  // Facility Actions
  bookFacility: (booking: Omit<FacilityBooking, 'id' | 'status' | 'created_at'>) => { success: boolean; message: string; booking?: FacilityBooking };
  cancelBooking: (bookingId: string) => void;
  updateFacilityStatus: (facilityId: string, status: any) => void;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'published_at' | 'read_by'>) => void;
  markAnnouncementRead: (announcementId: string, userId: string) => void;

  // Community
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'comments_count' | 'created_at'>) => void;
  toggleLikePost: (postId: string, userId: string) => void;
  addCommunityComment: (comment: Omit<CommunityComment, 'id' | 'created_at'>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'created_at'>) => void;

  // Reset
  resetToDemoData: () => void;
}

export const useHostelStore = create<HostelState>()(
  persist(
    (set, get) => ({
      hostel: initialHostel,
      blocks: initialBlocks,
      rooms: initialRooms,
      facilities: initialFacilities,
      requests: initialMaintenanceRequests,
      updates: [],
      announcements: initialAnnouncements,
      bookings: initialBookings,
      posts: initialCommunityPosts,
      comments: initialCommunityComments,
      notifications: initialNotifications,
      utilityReadings: initialUtilityReadings,

      // Maintenance Duplicate Detection Logic
      findDuplicates: (roomNumber, blockName, category, facilityId) => {
        const { requests } = get();
        return requests.filter((r) => {
          if (r.status === 'resolved' || r.status === 'rejected') return false;
          if (facilityId && r.facility_id === facilityId) return true;
          return (
            r.block_name.toLowerCase().includes(blockName.toLowerCase()) &&
            (r.room_number.toLowerCase() === roomNumber.toLowerCase() ||
             r.category === category)
          );
        });
      },

      addMaintenanceRequest: (reqData) => {
        const newId = `req-${Date.now().toString().slice(-4)}`;
        const now = new Date().toISOString();

        const newRequest: MaintenanceRequest = {
          ...reqData,
          id: newId,
          status: 'submitted',
          created_at: now,
          updated_at: now,
        };

        // Update room status if it's a specific room
        set((state) => {
          const updatedRooms = state.rooms.map((room) => {
            if (room.room_number.toLowerCase() === reqData.room_number.toLowerCase()) {
              return {
                ...room,
                status: 'issue_reported' as const,
                active_issues_count: room.active_issues_count + 1,
              };
            }
            return room;
          });

          // Add notification for admins/wardens/staff
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            user_id: 'warden-1',
            title: `New Maintenance Ticket: ${reqData.title}`,
            message: `${reqData.resident_name} reported ${reqData.category} issue in ${reqData.room_number} (${reqData.priority.toUpperCase()} priority).`,
            category: 'maintenance',
            link: `/app/maintenance/${newId}`,
            is_read: false,
            created_at: now,
          };

          return {
            requests: [newRequest, ...state.requests],
            rooms: updatedRooms,
            notifications: [newNotif, ...state.notifications],
          };
        });

        return newRequest;
      },

      updateRequestStatus: (id, newStatus, updatedBy, authorName, authorRole, notes, materials, evidenceUrl) => {
        const now = new Date().toISOString();

        set((state) => {
          let updatedReqTarget: MaintenanceRequest | undefined;
          const updatedRequests = state.requests.map((r) => {
            if (r.id === id) {
              const updated = {
                ...r,
                status: newStatus,
                updated_at: now,
                resolved_at: newStatus === 'resolved' ? now : r.resolved_at,
                resolution_notes: notes || r.resolution_notes,
                resolution_evidence_url: evidenceUrl || r.resolution_evidence_url,
                materials_used: materials ? [...(r.materials_used || []), ...materials] : r.materials_used,
              };
              updatedReqTarget = updated;
              return updated;
            }
            return r;
          });

          // If resolved, verify if room status should revert to normal
          let updatedRooms = state.rooms;
          if (newStatus === 'resolved' && updatedReqTarget) {
            const req = updatedReqTarget;
            const remainingIssues = updatedRequests.filter(
              (r) => r.room_number === req.room_number && r.status !== 'resolved' && r.status !== 'rejected'
            );
            if (remainingIssues.length === 0) {
              updatedRooms = state.rooms.map((rm) =>
                rm.room_number === req.room_number ? { ...rm, status: 'normal' as const, active_issues_count: 0 } : rm
              );
            }
          }

          // Create notification for resident
          const newNotifications = [...state.notifications];
          if (updatedReqTarget) {
            newNotifications.unshift({
              id: `notif-${Date.now()}`,
              user_id: updatedReqTarget.resident_id,
              title: `Maintenance Update: ${updatedReqTarget.title}`,
              message: `Status updated to "${newStatus.replace('_', ' ').toUpperCase()}". Notes: ${notes || 'No extra notes.'}`,
              category: 'maintenance',
              link: `/app/maintenance/${id}`,
              is_read: false,
              created_at: now,
            });
          }

          const newUpdateLog: MaintenanceUpdate = {
            id: `upd-${Date.now()}`,
            request_id: id,
            updated_by: updatedBy,
            author_name: authorName,
            author_role: authorRole,
            new_status: newStatus,
            notes,
            created_at: now,
          };

          return {
            requests: updatedRequests,
            rooms: updatedRooms,
            notifications: newNotifications,
            updates: [newUpdateLog, ...state.updates],
          };
        });
      },

      assignStaff: (requestId, staffId, staffName) => {
        const now = new Date().toISOString();
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  assigned_staff_id: staffId,
                  assigned_staff_name: staffName,
                  status: r.status === 'submitted' ? ('assigned' as const) : r.status,
                  updated_at: now,
                }
              : r
          ),
          notifications: [
            {
              id: `notif-${Date.now()}`,
              user_id: staffId,
              title: 'New Maintenance Assignment',
              message: `You have been assigned to ticket #${requestId}.`,
              category: 'maintenance',
              link: `/staff`,
              is_read: false,
              created_at: now,
            },
            ...state.notifications,
          ],
        }));
      },

      rateResolution: (requestId, rating, feedback) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  resolution_rating: rating,
                  resolution_feedback: feedback,
                  updated_at: new Date().toISOString(),
                }
              : r
          ),
        }));
      },

      // Facility Booking with Conflict Prevention
      bookFacility: (bookingData) => {
        const { bookings } = get();

        // Check for conflicting confirmed bookings for the same resource on the same date and slot
        const conflict = bookings.find(
          (b) =>
            b.status === 'confirmed' &&
            b.facility_id === bookingData.facility_id &&
            b.date === bookingData.date &&
            b.slot === bookingData.slot &&
            (b.resource_label === bookingData.resource_label || !bookingData.resource_label)
        );

        if (conflict) {
          return {
            success: false,
            message: `Conflict detected: ${bookingData.resource_label || 'This slot'} is already reserved by ${conflict.resident_name} (${conflict.slot}). Please choose another slot or machine.`,
          };
        }

        const newId = `book-${Date.now().toString().slice(-4)}`;
        const now = new Date().toISOString();

        const newBooking: FacilityBooking = {
          ...bookingData,
          id: newId,
          status: 'confirmed',
          created_at: now,
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              user_id: bookingData.resident_id,
              title: 'Booking Confirmed!',
              message: `Your booking for ${bookingData.facility_name} (${bookingData.resource_label || bookingData.slot}) on ${bookingData.date} is confirmed.`,
              category: 'facility',
              link: '/app/facilities',
              is_read: false,
              created_at: now,
            },
            ...state.notifications,
          ],
        }));

        return {
          success: true,
          message: 'Booking successfully confirmed!',
          booking: newBooking,
        };
      },

      cancelBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)),
        }));
      },

      updateFacilityStatus: (facilityId, status) => {
        set((state) => ({
          facilities: state.facilities.map((f) =>
            f.id === facilityId ? { ...f, status, updated_at: new Date().toISOString() } : f
          ),
        }));
      },

      // Announcements
      addAnnouncement: (annData) => {
        const newId = `ann-${Date.now().toString().slice(-4)}`;
        const now = new Date().toISOString();
        const newAnnouncement: Announcement = {
          ...annData,
          id: newId,
          published_at: now,
          read_by: [],
        };

        set((state) => ({
          announcements: [newAnnouncement, ...state.announcements],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              user_id: 'all',
              title: annData.is_critical ? `CRITICAL NOTICE: ${annData.title}` : `New Announcement: ${annData.title}`,
              message: annData.content.slice(0, 110) + '...',
              category: 'announcement',
              link: '/app/announcements',
              is_read: false,
              created_at: now,
            },
            ...state.notifications,
          ],
        }));
      },

      markAnnouncementRead: (announcementId, userId) => {
        set((state) => ({
          announcements: state.announcements.map((a) =>
            a.id === announcementId && !a.read_by.includes(userId)
              ? { ...a, read_by: [...a.read_by, userId] }
              : a
          ),
        }));
      },

      // Community
      addCommunityPost: (postData) => {
        const newPost: CommunityPost = {
          ...postData,
          id: `post-${Date.now()}`,
          likes: [],
          comments_count: 0,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
      },

      toggleLikePost: (postId, userId) => {
        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id === postId) {
              const hasLiked = p.likes.includes(userId);
              return {
                ...p,
                likes: hasLiked ? p.likes.filter((id) => id !== userId) : [...p.likes, userId],
              };
            }
            return p;
          }),
        }));
      },

      addCommunityComment: (commentData) => {
        const newComment: CommunityComment = {
          ...commentData,
          id: `comm-${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          comments: [...state.comments, newComment],
          posts: state.posts.map((p) =>
            p.id === commentData.post_id ? { ...p, comments_count: p.comments_count + 1 } : p
          ),
        }));
      },

      // Notifications
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        }));
      },

      markAllNotificationsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.user_id === userId || n.user_id === 'all' ? { ...n, is_read: true } : n
          ),
        }));
      },

      addNotification: (notif) => {
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif-${Date.now()}`,
              created_at: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        }));
      },

      // Reset
      resetToDemoData: () => {
        set({
          hostel: initialHostel,
          blocks: initialBlocks,
          rooms: initialRooms,
          facilities: initialFacilities,
          requests: initialMaintenanceRequests,
          updates: [],
          announcements: initialAnnouncements,
          bookings: initialBookings,
          posts: initialCommunityPosts,
          comments: initialCommunityComments,
          notifications: initialNotifications,
          utilityReadings: initialUtilityReadings,
        });
      },
    }),
    {
      name: 'dormiq-hostel-storage',
    }
  )
);

