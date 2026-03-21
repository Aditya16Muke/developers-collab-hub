const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    description:   { type: String, required: true },
    techStack:     [{ type: String }],
    owner:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status:        { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    maxTeamSize:   { type: Number, default: 5 },
    githubLink:    { type: String, default: '' },
    tags:          [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);