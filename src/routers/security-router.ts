import { Request, Response, Router } from "express";
import { sendStatus } from "./send-status";
import { authService } from '../domain/auth-service';
import { usersRepository } from '../repositories/users-repository';
import { deviceRepository } from '../repositories/device-repository';
import { DeviceViewModel } from '../models/devices/deviceViewModel';

export const securityRouter = Router({})

securityRouter.get('/devices',async (req: Request, res: Response) => {
 const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(sendStatus.UNAUTHORIZED_401).send({message: "Refresh token not found"})
  }
 
 const isValid = await authService.validateRefreshToken(refreshToken)
  if (!isValid || !isValid.userId || !isValid.deviceId) {
    return res.status(sendStatus.UNAUTHORIZED_401).send({message: "Invalid refresh token"})
  }

 const user = await usersRepository.findUserById(isValid.userId)
  if (!user) {
    return res.status(sendStatus.UNAUTHORIZED_401).send({message: "User not found"})
  }
  
  const device = await deviceRepository.findDeviceByUser(isValid.deviceId)
    if (!device) {
      return res.status(sendStatus.UNAUTHORIZED_401).send({message: "Device not found"})
    } 

    if (isValid.userId !== device.userId) {
      return res.status(sendStatus.UNAUTHORIZED_401).send({message: "Unathorized acsess to device"})
    }

  const result = await deviceRepository.getAllDevicesByUser(isValid.deviceId)
    if (!result) {
      res.status(sendStatus.UNAUTHORIZED_401)
    } else {
      res.status(sendStatus.OK_200).send(result)
    }
})

securityRouter.delete('/devices',async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  const isValid = await authService.validateRefreshToken(refreshToken)
    if (!isValid || !isValid.userId || !isValid.deviceId) {
      return res.status(sendStatus.UNAUTHORIZED_401).send({message: "Unathorized" })
    }
  
  const result = await deviceRepository.deleteAllDevicesExceptCurrent(isValid.userId, isValid.deviceId)
  if (result) {
    res.status(sendStatus.NO_CONTENT_204)
  } else {
    res.status(sendStatus.INTERNAL_SERVER_ERROR_500)
  }
})

securityRouter.delete('/devices/{deviceId}',async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  const deviceId = req.params.deviceId
  const isValid = await authService.validateRefreshToken(refreshToken)

    if (!isValid || !isValid.userId || !isValid.deviceId) {
      return res.status(sendStatus.UNAUTHORIZED_401).send({message: "Unauthorized"})
    }
    
  const user = await usersRepository.findUserById(isValid.userId)
    if (!user) {
      return res.status(sendStatus.UNAUTHORIZED_401).send({message: "User not found"})
    }

  const device = await deviceRepository.findDeviceByUser(deviceId)
    if (!device) {
      return res.status(sendStatus.NOT_FOUND_404)
    }
    if (device.userId !== isValid.userId) {
      return res.status(sendStatus.FORBIDDEN_403)
    }

  await deviceRepository.deleteDeviceById(deviceId)
    res.status(sendStatus.NO_CONTENT_204)
})