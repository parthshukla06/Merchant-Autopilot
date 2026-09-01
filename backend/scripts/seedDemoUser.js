const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const User = require("../models/User");
const Merchant = require("../models/Merchant");

const DEMO_EMAIL = "demo@merchantautopilot.ai";
const DEMO_PASSWORD = "Demo@123";

async function seedDemoUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const merchantId =
      process.env.DEMO_MERCHANT_ID ||
      "6a89dccdcc29ecf53a7612f3";

    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      throw new Error(
        `Demo merchant not found: ${merchantId}`
      );
    }

    const existingUser = await User.findOne({
      email: DEMO_EMAIL,
    });

    if (existingUser) {
      console.log("Demo user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      DEMO_PASSWORD,
      12
    );

    await User.create({
      name: "Demo Merchant",
      email: DEMO_EMAIL,
      password: hashedPassword,
      merchantId: merchant._id,
      role: "merchant",
    });

    console.log("Demo user created successfully");
    console.log(`Email: ${DEMO_EMAIL}`);
    console.log(`Password: ${DEMO_PASSWORD}`);
  } catch (error) {
    console.error(
      "Demo user seed failed:",
      error.message
    );
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDemoUser();