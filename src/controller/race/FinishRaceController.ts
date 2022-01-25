import { PrismaClient } from ".prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "process";
const prisma = new PrismaClient();

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

class FinishRaceController {
  async execute(request: Request, response: Response): Promise<Response> {
    try {
      const { token, corridaID } = request.body;
      const data = jwt.verify(token, env.SECRET_TOKEN);
      
      if(token === null || corridaID === null){
        throw new Error('ERRO')
      }

      const { id } = data as TokenPayload;
      
      const date = new Date();
      const hour = date.getHours() + ":" + date.getMinutes();

      const race = await prisma.race.findFirst({
        where:{
          id: corridaID
        }
      })

      if(!race){
        throw new Error("Essa corrida não existe...")
      }

      if(race.corridaCancelada === true){
        throw new Error ("Corrida cancelada.")
      }

      await prisma.race.update({
        where: {
          id: corridaID
        }, data:{
          horaFinal:hour,
          viagemConcluida:true
        }
      });


      
      return response.status(200).json("Concluído!");
    } catch (err) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
export { FinishRaceController };