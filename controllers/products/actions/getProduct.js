import db from '../../../db/models';

const getProduct = async req => {
  const { id } = req.query;

  const modelData = await db.products.findOne({ where: { id: parseInt(id) } });

  const data = modelData.get({ plain: true });

  return data;
};

export default getProduct;
