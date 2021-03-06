import {prisma} from '../../services/prisma'; import { Request, Response } from "express";
import bcrypt from "bcryptjs";



class CreateUserController {
  async execute(request: Request, response: Response) {
    
    try {
      

      const {
        customerName,
        customerAddress,
        customerEmail,
        customerPassword,
        customerBirthday,
      } = request.body;
      const date = new Date(customerBirthday)
      
      const userAlreadyExists = await prisma.user.findFirst({
        where: {
          email: customerEmail,
        },
      });

      if (userAlreadyExists) {
        throw new Error("email already in DB");
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(customerPassword, salt);

      await prisma.user.create({
        data: {
          name: customerName,
          address: customerAddress,
          password: hashPassword,
          birthday: date,
          email: customerEmail,
        },
      });

      return response.status(201).json({
        name: customerName,
        email: customerEmail,
      });
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  }
}

export { CreateUserController };
