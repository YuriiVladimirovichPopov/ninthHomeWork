import { UserViewModel } from "../models/users/userViewModel" 
import { MeViewType } from "../models/"


declare global {
    declare namespace Express {    
        export interface Request {
                user: UserViewModel | null
        }
    }
}