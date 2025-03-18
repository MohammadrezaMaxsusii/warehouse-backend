import mongoose from "mongoose";

const baseSchema = {
	pid: {
		type: mongoose.Types.ObjectId,
		required: false,
	},
	createdAt: {
		type: Number,
		default: Date.now,
		required: true,
	},
	updatedAt: {
		type: Number,
		default: Date.now,
		required: true,
	},
	deletedAt: {
		type: Number,
		required: false,
	},
};

export default baseSchema;
