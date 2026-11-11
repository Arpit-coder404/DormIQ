import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, AlertTriangle, CheckCircle2, Wrench, Wifi, Droplets, Zap, Package, Sparkles, LayoutGrid, Building, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { MaintenanceCategory, MaintenancePriority } from '../../types';

const maintenanceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(120, 'Title too long'),
  category: z.enum(['plumbing', 'electrical', 'wifi', 'furniture', 'appliances', 'cleaning', 'washroom', 'structural', 'other']),
  description: z.string().min(15, 'Please describe the issue in more detail (min 15 chars)').max(1500),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  block_name: z.string().min(1, 'Please select a block'),
  floor_number: z.string().min(1, 'Please enter a floor'),
  room_number: z.string().min(1, 'Please enter room number or area name'),
  preferred_time: z.string().optional(),
  is_common_area: z.boolean().optional(),
});

type FormData = z.infer<typeof maintenanceSchema>;

const categoryConfig = [
  { value: 'plumbing', label: 'Plumbing & Water', icon: Droplets },
  { value: 'electrical', label: 'Electrical & Power', icon: Zap },
  { value: 'wifi', label: 'Wi-Fi & Network', icon: Wifi },
  { value: 'furniture', label: 'Furniture & Fittings', icon: LayoutGrid },
  { value: 'appliances', label: 'Appliances', icon: Package },
  { value: 'cleaning', label: 'Cleaning & Hygiene', icon: Sparkles },
  { value: 'washroom', label: 'Washroom', icon: Building },
  { value: 'structural', label: 'Structural Damage', icon: Building },
  { value: 'other', label: 'Other', icon: Wrench },
];

interface DuplicateWarningProps {
  count: number;
  onViewExisting: () => void;
  onContinue: () => void;
}

const DuplicateWarning: React.FC<DuplicateWarningProps> = ({ count, onViewExisting, onContinue }) => (
  <div className="bg-warningAmber/10 border border-warningAmber/40 rounded-lg p-4 flex gap-3 mb-4">
    <AlertTriangle className="w-5 h-5 text-warningAmber flex-shrink-0 mt-0.5" />
    <div className="space-y-2">
      <p className="text-sm font-semibold text-warningAmber">Similar Issue Already Reported</p>
      <p className="text-xs text-ivory/80">
        {count} similar open {count === 1 ? 'report' : 'reports'} already exist in this area or for this category.
        You can follow the existing ticket or still submit yours if it's a distinct fault.
      </p>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onViewExisting}
          className="text-xs font-medium text-warningAmber underline underline-offset-2"
        >
          View existing reports
        </button>
        <span className="text-mutedGrey text-xs">|</span>
        <button
          type="button"
          onClick={onContinue}
          className="text-xs font-medium text-ivory underline underline-offset-2"
        >
          Submit anyway (distinct issue)
        </button>
      </div>
    </div>
  </div>
);

interface ReportMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomNumber?: string;
  initialBlockName?: string;
}

export const ReportMaintenanceModal: React.FC<ReportMaintenanceModalProps> = ({
  isOpen,
  onClose,
  initialRoomNumber,
  initialBlockName,
}) => {
  const { currentUser } = useAuthStore();
  const { addMaintenanceRequest, findDuplicates } = useHostelStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      block_name: initialBlockName || currentUser?.block_name?.split(' ')[0] || 'Block A',
      room_number: initialRoomNumber || currentUser?.room_number || '',
      floor_number: currentUser?.floor_number?.toString() || '1',
      category: 'plumbing',
      priority: 'medium',
    },
  });

  const selectedCategory = watch('category');
  const selectedPriority = watch('priority');

  const checkDuplicates = (data: FormData) => {
    const dupes = findDuplicates(data.room_number, data.block_name, data.category);
    setDuplicates(dupes);
    return dupes;
  };

  const onSubmit = async (data: FormData) => {
    if (step === 1) {
      const dupes = checkDuplicates(data);
      if (dupes.length > 0 && !showDuplicateWarning) {
        setShowDuplicateWarning(true);
        return;
      }
      setStep(2);
      return;
    }

    if (!currentUser) return;

    const newRequest = addMaintenanceRequest({
      resident_id: currentUser.id,
      resident_name: currentUser.full_name,
      room_number: data.room_number,
      block_name: data.block_name,
      floor_number: parseInt(data.floor_number, 10),
      title: data.title,
      description: data.description,
      category: data.category as MaintenanceCategory,
      priority: data.priority as MaintenancePriority,
      preferred_time: data.preferred_time,
    });

    setSubmittedId(newRequest.id);
    setSubmitted(true);
  };

  const handleClose = () => {
    reset();
    setStep(1);
    setSubmitted(false);
    setSubmittedId('');
    setShowDuplicateWarning(false);
    setDuplicates([]);
    onClose();
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
        <div className="bg-graphite border border-graphite-border rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-lime" />
          </div>
          <h2 className="text-xl font-display font-bold text-ivory mb-2">Request Submitted</h2>
          <p className="text-sm text-mutedGrey mb-1">Ticket ID</p>
          <p className="font-mono text-lime text-lg font-bold mb-4">#{submittedId.toUpperCase()}</p>
          <p className="text-xs text-mutedGrey mb-6 leading-relaxed">
            Your maintenance request is live. You'll be notified when a technician is assigned and when the work begins.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleClose();
                window.location.href = `/app/maintenance/${submittedId}`;
              }}
              className="flex-1 py-2.5 text-sm font-medium bg-lime hover:bg-lime-glow text-obsidian rounded-lg transition-all"
            >
              Track Request
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 text-sm border border-graphite-border text-ivory rounded-lg hover:bg-graphite-light transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-obsidian/70 backdrop-blur-sm">
      <div className="bg-graphite border-l border-graphite-border h-full w-full max-w-lg flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-obsidian-light border-b border-graphite-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg text-ivory">Report a Maintenance Issue</h2>
            <p className="text-xs text-mutedGrey">Step {step} of 2 — {step === 1 ? 'Issue Details' : 'Review & Submit'}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-mutedGrey hover:text-ivory hover:bg-graphite transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {showDuplicateWarning && duplicates.length > 0 && (
            <DuplicateWarning
              count={duplicates.length}
              onViewExisting={() => {
                handleClose();
                window.location.href = '/app/maintenance';
              }}
              onContinue={() => setShowDuplicateWarning(false)}
            />
          )}

          {step === 1 && (
            <>
              {/* Category Grid */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-3">Issue Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categoryConfig.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setValue('category', cat.value as any)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-forest/40 border-forest text-lime shadow-sm'
                            : 'bg-obsidian/60 border-graphite-border text-mutedGrey hover:border-sage/40 hover:text-ivory'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-alertCoral text-xs mt-1">{errors.category.message}</p>}
              </div>

              {/* Issue Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-1.5">Issue Title</label>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="e.g. Bathroom tap leaking, Wi-Fi not connecting..."
                  className="w-full bg-obsidian border border-graphite-border rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/50 transition-colors"
                />
                {errors.title && <p className="text-alertCoral text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-1.5">Detailed Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe what's wrong, when it started, and any relevant details..."
                  className="w-full bg-obsidian border border-graphite-border rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/50 transition-colors resize-none"
                />
                {errors.description && <p className="text-alertCoral text-xs mt-1">{errors.description.message}</p>}
              </div>

              {/* Location */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-1.5">Block</label>
                  <select
                    {...register('block_name')}
                    className="w-full bg-obsidian border border-graphite-border rounded-lg px-3 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime/50 transition-colors"
                  >
                    <option>Block A</option>
                    <option>Block B</option>
                    <option>Block C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-1.5">Floor</label>
                  <select
                    {...register('floor_number')}
                    className="w-full bg-obsidian border border-graphite-border rounded-lg px-3 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime/50 transition-colors"
                  >
                    {['0', '1', '2', '3', '4'].map((f) => (
                      <option key={f} value={f}>{f === '0' ? 'Ground' : `Floor ${f}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-1.5">Room / Area</label>
                  <input
                    {...register('room_number')}
                    placeholder="A-204"
                    className="w-full bg-obsidian border border-graphite-border rounded-lg px-3 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/50 transition-colors"
                  />
                </div>
              </div>
              {(errors.block_name || errors.floor_number || errors.room_number) && (
                <p className="text-alertCoral text-xs">{errors.room_number?.message}</p>
              )}

              {/* Priority */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-2">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => {
                    const isSelected = selectedPriority === p;
                    const colors = {
                      low: 'border-sage/40 text-sage data-selected:bg-sage/10 data-selected:border-sage data-selected:text-sage',
                      medium: 'border-coolBlue/40 text-coolBlue data-selected:bg-coolBlue/10 data-selected:border-coolBlue',
                      high: 'border-warningAmber/40 text-warningAmber data-selected:bg-warningAmber/10 data-selected:border-warningAmber',
                      urgent: 'border-alertCoral/40 text-alertCoral data-selected:bg-alertCoral/10 data-selected:border-alertCoral',
                    };
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setValue('priority', p)}
                        className={`py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                          isSelected
                            ? p === 'urgent'
                              ? 'bg-alertCoral/15 border-alertCoral text-alertCoral'
                              : p === 'high'
                              ? 'bg-warningAmber/15 border-warningAmber text-warningAmber'
                              : p === 'medium'
                              ? 'bg-coolBlue/15 border-coolBlue text-coolBlue'
                              : 'bg-sage/15 border-sage text-sage'
                            : 'bg-obsidian border-graphite-border text-mutedGrey hover:text-ivory'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-1.5">Preferred Time for Inspection (Optional)</label>
                <input
                  {...register('preferred_time')}
                  type="text"
                  placeholder="e.g. After 5 PM on weekdays"
                  className="w-full bg-obsidian border border-graphite-border rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/50 transition-colors"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-forest/20 border border-forest rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm text-lime">Review Your Request</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-mutedGrey mb-0.5">Category</p>
                    <p className="text-ivory capitalize">{watch('category')}</p>
                  </div>
                  <div>
                    <p className="text-mutedGrey mb-0.5">Priority</p>
                    <p className="text-ivory capitalize">{watch('priority')}</p>
                  </div>
                  <div>
                    <p className="text-mutedGrey mb-0.5">Location</p>
                    <p className="text-ivory">{watch('room_number')}, {watch('block_name')}, Floor {watch('floor_number')}</p>
                  </div>
                  <div>
                    <p className="text-mutedGrey mb-0.5">Preferred Time</p>
                    <p className="text-ivory">{watch('preferred_time') || 'Flexible'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-mutedGrey text-xs mb-0.5">Title</p>
                  <p className="text-ivory text-sm font-medium">{watch('title')}</p>
                </div>
                <div>
                  <p className="text-mutedGrey text-xs mb-0.5">Description</p>
                  <p className="text-ivory text-xs leading-relaxed">{watch('description')}</p>
                </div>
              </div>

              <div className="bg-lime/5 border border-lime/20 rounded-lg p-3 text-xs text-mutedGrey">
                By submitting, the hostel maintenance team is notified of this issue immediately. You will receive in-app notifications as the status progresses.
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="border-t border-graphite-border px-6 py-4 flex gap-3 flex-shrink-0 bg-obsidian-light">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-graphite-border text-ivory rounded-lg text-sm font-medium hover:bg-graphite transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-lime hover:bg-lime-glow text-obsidian rounded-lg text-sm font-semibold transition-all shadow-lg shadow-lime/10 active:scale-[0.98] disabled:opacity-60"
          >
            {step === 1 ? 'Continue to Review →' : 'Submit Maintenance Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

