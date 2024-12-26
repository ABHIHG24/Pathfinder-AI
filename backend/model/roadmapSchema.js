const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  careerTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  roadmapSteps: [
    {
      stepTitle: {
        type: String,
      },
      stepDescription: {
        type: String,
      },
      resources: [
        {
          title: { type: String },
          link: { type: String },
          type: {
            type: String,
            enum: ["video", "article", "book"],
          },
        },
      ],
      completed: {
        type: Boolean,
        default: false, // indicates whether the step is completed or not
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

module.exports = Roadmap;
