import { db } from "@/lib/prisma";
import ProductItem from "@/app/products/components/product-item";
import { Prisma } from "@prisma/client";

interface ProductListProps {
    products: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    }>[];
}

const ProductList = async ({ products }: ProductListProps) => {

// const ProductList = async () => {
  // const products = await db.product.findMany({
  //   where: {
  //     discountPercentage: {
  //       gt: 0,
  //     },
  //   },
  //   take: 10,
  //   include: {
  //     restaurant: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //   },
  // });

    return (
      <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    );
};

export default ProductList;