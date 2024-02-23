import { Promotion } from "./Promotion";
import { User } from "./User";

export class Ticket{
    constructor( public _id?:string, public events?:String,public locals?:String,public price?:Number, public date?:Date,public free?:Boolean,public users?:User[],public promotion?:Promotion[]){ }
}