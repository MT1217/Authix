import { Tenant } from '../models/Tenant.js';
import { ChatThread } from '../models/ChatThread.js';
import { Content } from '../models/Content.js';
import { Submission } from '../models/Submission.js';
import { User } from '../models/User.js';

/**
 * Admin-only: update tenant branding. Isolation: only req.tenant (same as header) is updated.
 */
export async function updateBranding(req, res) {
  try {
    const { logo, primaryColor } = req.body;

    const tenant = await Tenant.findById(req.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (logo !== undefined) tenant.branding.logo = logo;
    if (primaryColor !== undefined) tenant.branding.primaryColor = primaryColor;

    await tenant.save();

    return res.json({
      logo: tenant.branding.logo,
      primaryColor: tenant.branding.primaryColor,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Branding update failed', error: error.message });
  }
}

/**
 * Admin-only: company overview scoped to the current tenant.
 *
 * Multi-tenant isolation:
 * - tenantHandler resolved tenant and set req.tenantId
 * - requireSameTenant ensures the JWT tenant matches req.tenantId
 * - every query below includes { tenantId: req.tenantId }
 */
export async function getCompanyOverview(req, res) {
  try {
    const tenant = await Tenant.findById(req.tenantId).select('name subdomain').lean();

    const mentors = await User.find({ tenantId: req.tenantId, role: 'mentor' })
      .select('email profile.name profile.expertise createdAt')
      .lean();

    const studentsCount = await User.countDocuments({ tenantId: req.tenantId, role: 'student' });

    const contentCount = await Content.countDocuments({ tenantId: req.tenantId });

    const submissionsTotal = await Submission.countDocuments({ tenantId: req.tenantId });
    const submissionsEvaluated = await Submission.countDocuments({
      tenantId: req.tenantId,
      status: 'evaluated',
    });
    const submissionsPending = submissionsTotal - submissionsEvaluated;

    const activeChatThreads = await ChatThread.countDocuments({ tenantId: req.tenantId });

    const progress = {
      contentCount,
      submissionsTotal,
      submissionsEvaluated,
      submissionsPending,
      evaluationRate: submissionsTotal ? Math.round((submissionsEvaluated / submissionsTotal) * 100) : 0,
      activeChatThreads,
    };

    // Basic tenant-scoped revenue metrics placeholder (hook up to Transactions later)
    const revenue = {
      gross: 0,
      platformFee: 0,
      mentorShare: 0,
      note: 'Revenue metrics placeholder. Connect to Stripe/Transaction aggregation to make live.',
    };

    return res.json({
      tenantId: req.tenantId,
      tenantName: tenant?.name || '',
      tenantSubdomain: tenant?.subdomain || '',
      mentors,
      studentsCount,
      mentorsCount: mentors.length,
      progress,
      revenue,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load company overview', error: error.message });
  }
}
