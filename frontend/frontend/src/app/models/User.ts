export class User{
    constructor( public _id?:string, public username?:string, public password?:string,public email?:string,public firstName?:string,public lastName?:string, public dateOfBirth?:Date,public createdAt?:Date,public balance?:Number,public points?:Number,public deleted?:Boolean){ }
}