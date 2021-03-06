import {prisma} from '../../services/prisma'; import { Request, Response } from "express";



class RaceCancelController {
  async execute(request: Request, response: Response): Promise<Response> {
    try {
      const { idCorrida } = request.body;

      const corrida = await prisma.race.findFirst({
        where: { id: idCorrida },
      });

      if (!corrida) {
        throw new Error("Corrida não encontrada");
      }

      if (corrida.corridaCancelada === true) {
        throw new Error("Corrida já cancelada");
      }

      if(corrida.viagemConcluida === true){
        throw new Error("Corrida já finalizada")
      }

      await prisma.race.update({
        where: { id: idCorrida },
        data: {
          corridaCancelada: true,
        },
      });

      return response.status(201).json("Corrida Cancelada");
    } catch (err) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}
export { RaceCancelController };
