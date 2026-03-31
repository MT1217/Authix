import mongoose from 'mongoose';

/**
 * Financial record for Stripe activity within one tenant.
 * Logical isolation: never list or mutate transactions without tenantId in the query filter.
 */
const transactionSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    amountCents: { type: Number, required: true },
    platformFeeCents: { type: Number, required: true },
    stripePaymentIntentId: { type: String, default: '' },
    stripeCheckoutSessionId: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

transactionSchema.index({ tenantId: 1, createdAt: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
