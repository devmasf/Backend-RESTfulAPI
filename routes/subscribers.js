const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");
const subscriber = require("../models/subscriber");

// Get all the subscribers
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).json({ message: error.message }); // Sending the message to the user
  }
});

// Get one subscriber
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Create one subscriber
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedChannel: req.body.subscribedChannel,
  });
  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber); // Success Status 201
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one subscriber
// The "PATCH" method is being used here, in order to update pieces of the subscriber’s information and not all the information of the subscriber
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedChannel != null) {
    res.subscriber.subscribedChannel = req.body.subscribedChannel;
  }
  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete one subscriber
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.deleteOne();
    res.json({ message: "Deleted This Subscriber" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getSubscriber(req, res, next) {
  try {
    let subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  next();
}

module.exports = router;
