import prisma from "../../../prisma/prismaClient/prismaClient";

const userHandler = async (req, res) => {
  // res.status(200).json({ name: 'John Doe' })
  switch (req.method) {
    case 'POST':
      const { body } = req;
      const data = typeof body === "string" ? JSON.parse(body) : body;

      const savedUser = await prisma.users.create({ data });

      res.status(200).json(savedUser);
      break;
    default:
      res.status(405).json({ msg: 'Invalid method' })
      break;
  }
}

export default userHandler;
