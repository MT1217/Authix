import { Content } from '../models/Content.js';
import { User } from '../models/User.js';

/**
 * Marketplace: list purchasable content for this tenant only.
 */
export async function listMarketplace(req, res) {
  try {
    const items = await Content.find({ tenantId: req.tenantId }).select('title url priceCents mentorId');
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Marketplace failed', error: error.message });
  }
}

/**
 * Student's unlocked content after successful payment (webhook adds IDs).
 */
export async function listMyContent(req, res) {
  try {
    const user = await User.findOne({ _id: req.user.userId, tenantId: req.tenantId }).populate(
      'unlockedContentIds'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.unlockedContentIds || []);
  } catch (error) {
    return res.status(500).json({ message: 'Could not load content', error: error.message });
  }
}
