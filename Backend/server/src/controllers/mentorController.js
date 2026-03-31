import { Content } from '../models/Content.js';
import mongoose from 'mongoose';

/**
 * Mentor-only: create or version content. Every document includes tenantId for isolation.
 */
export async function createContent(req, res) {
  try {
    const { title, url, priceCents } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'title and url are required' });
    }

    const mentorId = new mongoose.Types.ObjectId(req.user.userId);

    const content = await Content.create({
      tenantId: req.tenantId,
      mentorId,
      title,
      url,
      priceCents: Number(priceCents) || 0,
      versionHistory: [{ version: 1, url, label: 'Initial' }],
    });

    return res.status(201).json(content);
  } catch (error) {
    return res.status(500).json({ message: 'Content creation failed', error: error.message });
  }
}

/**
 * Append a new version — still scoped to tenant + owning mentor.
 */
export async function addContentVersion(req, res) {
  try {
    const { contentId } = req.params;
    const { url, label } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'url is required' });
    }

    const content = await Content.findOne({
      _id: contentId,
      tenantId: req.tenantId,
      mentorId: new mongoose.Types.ObjectId(req.user.userId),
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found or not owned by this mentor' });
    }

    const nextVersion = (content.versionHistory?.length || 0) + 1;
    content.versionHistory.push({ version: nextVersion, url, label: label || `v${nextVersion}` });
    content.url = url;
    await content.save();

    return res.json(content);
  } catch (error) {
    return res.status(500).json({ message: 'Version update failed', error: error.message });
  }
}
