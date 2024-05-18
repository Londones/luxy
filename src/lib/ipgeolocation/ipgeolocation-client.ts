"use server";
import { db } from "../db";

export const createVisit = async (funnelPageId: string) => {
  try {
    const location: string = await new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve(JSON.stringify({ latitude, longitude }));
          },
          (error) => {
            console.error(`Error: ${error.message}`);
            resolve(JSON.stringify({ latitude: 0, longitude: 0 }));
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve(JSON.stringify({ latitude: 0, longitude: 0 }));
      }
    });

    const data = {
      funnelPageId: funnelPageId,
      location: location,
    };

    const res = await db.visit.create({
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};
