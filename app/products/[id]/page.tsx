import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "@/app/products/components/product-details";
import ProductImage from "@/app/products/components/product-image";

interface ProductPageProps {
    params: {
      id: string;
    };
}
  
const ProductPage = async ({ params: { id } }: ProductPageProps) => {
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        restaurant: true,
      },
    });
  
    if (!product) {
        return notFound();
    }
    
    const juices = await db.product.findMany({
      where: {
        category: {
          name: "Sucos",
        },
        restaurant: {
            id: product?.restaurant.id,
        },
      },
      include: {
        restaurant: true,
      },
    });
  
    // if (!product) {
    //   return notFound();
    // }
  
    return (
      <div>
        {/* IMAGEM */}
        <ProductImage product={product} />
  
        {/* TITULO E PREÇO */}
        <ProductDetails product={product} complementaryProducts={juices} />
      </div>
    );
};
  
export default ProductPage;