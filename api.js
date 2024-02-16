import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * removes all headers in browser developer tools displaying data such as what your server is using, ex. X-Powered-By: Express
 */
app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.removeHeader("Connection");
    res.removeHeader("set-cookie");
    res.removeHeader("Date");
    res.setHeader("Created-By", "iiTxicz | jackasu");
    next();
});

app.get("/user-icon", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const robloxUserId = req.headers['roblox-id'];

    if (!robloxUserId) return res.status(404).json({ api_error: "No headers found, required headers are needed" });
    

    /**
     * checks to see if this is a Integer
     */
    const ruIDN = parseInt(robloxUserId);
    if (isNaN(ruIDN) || !Number.isInteger(ruIDN)) return res.status(400).json({ api_error: "roblox-id must be an integer, request not processed" });

    const avatar = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${ruIDN}&size=720x720&format=Png&isCircular=false`, { // going off of https://thumbnails.roblox.com/docs/index.html
        method: "GET",
        headers: { 'accept': 'application/json' }
    });
    const receivedAvatar = await avatar.json();
    if (!receivedAvatar) return res.status(500).json({ api_error: "Internal Server Error: failed to fetch User's Avatar"})

    const headshot = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ruIDN}&size=720x720&format=Png&isCircular=false`, {
        headers: { 'accept': 'application/json' },
        method: "GET"
    });
    const receivedHeadshot = await headshot.json();
    if (!receivedHeadshot) return res.status(500).json({ api_error: "Internal Server Error: failed to fetch User's Headshot" });


    const r = {
        success:true,
        "created-by": "iiTxicz",
        data: [
            { avatar: receivedAvatar.data[0].imageUrl },
            { headshot: receivedHeadshot.data[0].imageUrl }
        ]
    };

    res.status(200).json(r);
})

app.all("*", (req, res) => {
    res.status(404).send(); // no error message displays basic error page that browser provides
});

app.listen(PORT, () => {
    console.log(`API Server running on http://127.0.0.1:${PORT}`);
});