export type UserViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
    //passwordSalt: string,
    //passwordHash: string
    emailConfirmation: EmailConfirmationType 
}

export type EmailConfirmationType = {
    isConfirmed: boolean,
    confirmationCode: string,
    expirationDate: Date
}