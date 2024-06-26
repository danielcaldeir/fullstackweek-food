import CategoryList from "@/app/categories/components/category-list";
import Header from "@/components/header";
import ProductList from "@/app/products/components/product-list";
import PromoBanner from "@/components/promo-banner";
import RestaurantList from "@/app/restaurants/components/restaurant-list";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const fetch = async() => {
  const getProducts = db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  // const getBurguersCategory = db.category.findFirst({
  //   where: {
  //     name: "Hambúrgueres",
  //   },
  // });

  // const getPizzasCategory = db.category.findFirst({
  //   where: {
  //     name: "Pizzas",
  //   },
  // });

  // const [products, burguersCategory, pizzasCategory] = await Promise.all([
  //   getProducts,
  //   getBurguersCategory,
  //   getPizzasCategory,
  // ]);

  const [products, ] = await Promise.all([
    getProducts
  ]);

  // return { products, burguersCategory, pizzasCategory };
  return { products };
}

const Home = async() => {
  // const { products, burguersCategory, pizzasCategory } = await fetch();
  const { products, } = await fetch();

    return (
      <main className="flex min-h-screen flex-col justify-normal ">
        <Header />
        
        <div className="px-5 pt-6">
          <Search />
        </div>

        <div className="px-5 pt-6">
          <CategoryList />
        </div>

        <div className="px-5 pt-6">
          {/* <Link href={`/categories/${pizzasCategory?.id}/products`}> */}
          <PromoBanner
            src="/promo-banner-01.png"
            alt="Até 30% de desconto em pizzas!"
          />
          {/* </Link> */}
        </div>

        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-semibold">Pedidos Recomendados</h2>
            <Button variant="ghost" className="h-fit p-0 text-primary hover:bg-transparent" asChild>
              <Link href="/products/recommended">
                Ver todos
                <ChevronRightIcon size={16} />
              </Link>
            </Button>
          </div>
          <ProductList products={products} />
        </div>

        <div className="px-5 pt-6">
          {/* <Link href={`/categories/${burguersCategory?.id}/products`}> */}
          <PromoBanner
            src="/promo-banner-02.png"
            alt="A partir de R$17,90 em lanches"
          />
          {/* </Link> */}
        </div>

        <div className="space-y-4 py-6">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-semibold">Restaurantes Recomendados</h2>
            <Button variant="ghost" className="h-fit p-0 text-primary hover:bg-transparent" asChild>
              <Link href="/restaurants/recommended">
                Ver todos
                <ChevronRightIcon size={16} />
              </Link>
            </Button>
          </div>
          <RestaurantList />
        </div>

      </main>
    );
}
  
export default Home;