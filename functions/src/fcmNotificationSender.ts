import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Request, Response} from "express";
import {getNotificationReionTopic, Region} from "./constants/Constants";
const messaging = admin.messaging();

export interface FCMNotificationSenderRequestBody {
  region: Region
  postingWindowDate: string;
}

type FCMNotificationSenderRequest =
  Request<object, unknown, FCMNotificationSenderRequestBody>;

export const fcmNotificationSender = functions.https.onRequest(
  async (req: FCMNotificationSenderRequest, res: Response) => {
    const {region, postingWindowDate} = req.body;

    if (!region || !postingWindowDate) {
      res.status(400).send("Missing required fields");
      return;
    }

    const regionTopic = getNotificationReionTopic(region);

    await messaging.send({
      topic: regionTopic,
      notification: {
        title: "⏰ Time to Reflekt ⏰",
        body: "Take a moment to pause and reflect on " +
          "something you’re grateful for today!",
      },
    });

    res.status(200).send(
      `Notification sent for ${region} on ${postingWindowDate}`
    );
  }
);
