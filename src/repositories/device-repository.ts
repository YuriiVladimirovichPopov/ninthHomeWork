import { DeviceViewModel } from "../models/devices/deviceViewModel";
import { DeviceMongoDbType } from "../types";
import { deviceCollection } from "../db/db";
import { ObjectId } from "mongodb";

export const deviceRepository = {
  async findDeviceByUser(deviceId: string): Promise<DeviceMongoDbType | null> {
    try {
      const device = await deviceCollection.findOne({ deviceId });
      return device;
    } catch (error) {
      console.error("Error finding device by ID:", error);
      return null;
    }
  },

  async getAllDevicesByUser(userId: string): Promise<DeviceMongoDbType[]> {
    try {
      const devices = await deviceCollection
        .find({ userId }, { projection: { _id: 0, userId: 0 } })
        .toArray();
      return devices;
    } catch (error) {
      console.error("Error getting devices by userId:", error);
      return [];
    }
  },

  async deleteDeviceById(user: string, deviceId: string): Promise<boolean> {
    try {
      const result = await deviceCollection.deleteOne({ user, deviceId });
      if (result.deletedCount === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error deleting device by ID:", error);
      return false;
    }
  },

  async deleteAllDevicesExceptCurrent(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    try {
      await deviceCollection.deleteMany({
        userId,
        deviceId: { $ne: deviceId },
      });
      return true;
    } catch (error) {
      throw new Error("Failed to refresh tokens");
    }
  },
  // new function for testing all data
  async deleteAllDevices(): Promise<boolean> {
    try {
      const result = await deviceCollection.deleteMany({});
      return result.acknowledged === true;
    } catch (error) {
      return false;
    }
  },
};
