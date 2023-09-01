const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// Use the cors middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send-notifications", async (req, res) => {
  try {
    const { notificationTitle, notificationMessage, expoPushTokens } = req.body;

    if (
      !notificationTitle ||
      !notificationMessage ||
      !expoPushTokens ||
      expoPushTokens.length === 0
    ) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const notifications = expoPushTokens.map((token) => ({
      to: token,
      sound: "default",
      title: notificationTitle,
      body: notificationMessage,
      data: { data: "goes here" },
    }));

    const responses = await Promise.all(
      notifications.map((notification) =>
        axios.post("https://exp.host/--/api/v2/push/send", notification, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
    );

    res.status(200).json(responses.map((response) => response.data));
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
