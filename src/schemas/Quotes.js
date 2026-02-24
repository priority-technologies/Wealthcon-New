import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL for a video!`,
      },
    },
    imageFileName: {
      type: String,
      required: [true, "Image file name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Quotes = mongoose.models.Quotes || mongoose.model("Quotes", QuoteSchema);

export default Quotes;
