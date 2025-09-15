// fetch all users which are in same tenant group as admin
import User from "../models/userModel.js";
// export const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find({}, '-password'); // Exclude passwords
//         res.status(200).json({ success: true, data: users });
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// };

export const getAllUsers = async (req, res) => {
    const tenantGroup = req.query.group;
    if (!tenantGroup) {
        return res.status(400).json({ success: false, message: "Tenant group is required" });
    }
    try {
        const users = await User.find({ tenants: tenantGroup }, '-password'); // Exclude passwords
        console.log("Fetched users successfully");
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log("catch erroe")
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// update user subscription
export const updateSubscription = async (req, res) => {
    const { id } = req.params;
    const { subscription } = req.body; // expected "free" or "pro"
    if (!["free", "pro"].includes(subscription)) {
        return res.status(400).json({ success: false, message: "Invalid subscription type" });
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.subscription = subscription;
        await user.save();
        res.status(200).json({ success: true, message: "Subscription updated", data: user });
    } catch (error) {
        console.error("Error updating subscription:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// delete a user
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success : false, message: "Server error" });
    }
};
