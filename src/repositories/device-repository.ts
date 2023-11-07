import { DeviceViewModel } from '../models/devices/deviceViewModel';


export const deviceRepository = {
    
    async findAllDevices(): Promise<DeviceViewModel> {
        return true
    },

    async deleteDeviceById(deviceId: string): Promise<DeviceViewModel> {
        return 
    },

    async deleteAllDevices(): Promise<DeviceViewModel> {
        return
    }
}